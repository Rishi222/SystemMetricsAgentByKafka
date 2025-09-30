// ipfinder.js
const si = require("systeminformation");

async function ipFinder() {
  try {
    const system = await si.system();
    const osInfo = await si.osInfo();
    const networkInterfaces = await si.networkInterfaces();

    // Pick active network interface (ignoring virtual / docker / loopback)
    const activeInterfaces = networkInterfaces.filter(
      (iface) => iface.ip4 && iface.ip4 !== "127.0.0.1"
    );

    const data = {
      hostname: osInfo.hostname || "unknown",
      os: {
        platform: osInfo.platform,
        distro: osInfo.distro,
        release: osInfo.release,
      },
      system: {
        manufacturer: system.manufacturer,
        model: system.model,
        serial: system.serial || "unknown",
      },
      network: activeInterfaces.map((iface) => ({
        iface: iface.iface,
        ip4: iface.ip4,
        ip6: iface.ip6,
        mac: iface.mac,
        internal: iface.internal,
      })),
      timestamp: new Date().toISOString(),
    };

    console.log("📡 IP Finder Result:");
    console.log(JSON.stringify(data, null, 2));

    return data;
  } catch (err) {
    console.error("❌ Error fetching system info:", err);
  }
}

// Run directly if executed from CLI
if (require.main === module) {
  ipFinder();
}

module.exports = ipFinder;

const si = require("systeminformation");

async function ipFinder() {
  try {
    const network = await si.networkInterfaces();
    const defaultIface = network.find((iface) => iface.default) || network[0];

    return {
      hostname: await si.osInfo().then((os) => os.hostname),
      ip: defaultIface?.ip4 || "unknown",
      mac: defaultIface?.mac || "unknown",
      iface: defaultIface?.iface || "unknown",
      type: defaultIface?.type || "unknown",
    };
  } catch (err) {
    console.error("❌ Error fetching network info:", err);
    return { error: "Failed to get IP info" };
  }
}

module.exports = ipFinder;
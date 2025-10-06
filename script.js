require("dotenv").config();
const si = require("systeminformation");
const axios = require("axios");
const os = require("os");

// here i send the data to send-data with server base id.
// await axios.post(`${SERVER_BASE}/send-data`, { producerId: uniqueId, ...data });

// CONFIG
const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000/send-data";
const SEND_INTERVAL = 3000; // every 3 seconds

// Unique identity for hostname
const uniqueId = os.hostname();

// Helper: Safe call wrapper
const safeCall = async (fn) => {
  try {
    return await fn();
  } catch {
    return null;
  }
};

// Collect system data
async function collectData() {
  const osInfo = await safeCall(si.osInfo);
  const system = await safeCall(si.system);
  const cpu = await safeCall(si.cpu);
  const mem = await safeCall(si.mem);
  const networkInterfaces = await safeCall(si.networkInterfaces);
  const networkStats = await safeCall(si.networkStats);
  const battery = await safeCall(si.battery);
  const users = await safeCall(si.users);
  const servicesList = ["ai_service", "docker", "nginx"];
  const services = await safeCall(() => si.services(servicesList.join(",")));

  return {
    timestamp: new Date().toISOString(),
    hostname: osInfo?.hostname || "unknown",
    system: {
      manufacturer: system?.manufacturer || "unknown",
      model: system?.model || "unknown",
      version: system?.version || "unknown",
      type: system?.type || "unknown",
    },
    osinfo: {
      platform: osInfo?.platform || "unknown",
      distro: osInfo?.distro || "unknown",
      codename: osInfo?.codename || "unknown",
    },
    cpu: {
      manufacturer: cpu?.manufacturer || "unknown",
      brand: cpu?.brand || "unknown",
      cores: cpu?.cores || 0,
    },
    memory: {
      total: mem?.total || 0,
      free: mem?.free || 0,
      used: mem?.used || 0,
    },
    networkInterfaces: (networkInterfaces || [])
      .filter((n) => n.default)
      .map((n) => ({ mac: n.mac, ip4: n.ip4 })),
    networkStats: (networkStats || []).map((n) => ({ iface: n.iface })),
    battery: {
      isCharging: battery?.isCharging || null,
      percent: battery?.percent || null,
    },
    services: (services || []).map((s) => ({ name: s.name })),
    users: [...new Set((users || []).map((u) => u.user))].map((user) => ({
      user,
    })),
  };
}

// Send data to central consumer backend
async function sendData() {
  try {
    const data = await collectData();
    // send data to backend via /send-data
    const response = await axios.post(SERVER_URL, data);

    console.log("📤 Data sent successfully!");
    console.log("🖥️ Sent Data Preview:", {
      hostname: data.hostname,
      cpu: data.cpu.brand,
      memoryUsedMB: (data.memory.used / (1024 * 1024)).toFixed(2),
      network: data.networkInterfaces,
    });
    console.log("📡 Server Response:", response.data.message || response.data);
    console.log("──────────────────────────────────────\n");
  } catch (err) {
    console.error("❌ Error sending data:", err.message);
  }
}

// Run every few seconds
(async () => {
  console.log(`🚀 Starting Producer Client...`);
  console.log(`🌐 Sending data to: ${SERVER_URL}`);
  await sendData();
  setInterval(sendData, SEND_INTERVAL);
})();

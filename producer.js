require("dotenv").config();          
const kafka = require("./middlewares/kafka");
const si = require("systeminformation");

async function runProducer() {
  const producer = kafka.producer();
  await producer.connect();
  console.log("✅ Producer connected to Kafka");

  const safeCall = async (fn) => {        // here the safe call function is use to handle the error if any error occur it return null
    try {
      return await fn();
    } catch {
      return null;
    }
  };

  async function collectData() {          // here the collect data function is use to collect the data from the systeminformation module
    const osInfo = await safeCall(si.osInfo);
    const system = await safeCall(si.system);
    const cpu = await safeCall(si.cpu);
    const mem = await safeCall(si.mem);
    const networkInterfaces = await safeCall(si.networkInterfaces);
    const networkStats = await safeCall(si.networkStats);
    const battery = await safeCall(si.battery);
    const users = await safeCall(si.users);
    const servicesList = ["ai_service", "docker", "nginx"];                             // define important services
    const services = await safeCall(() => si.services(servicesList.join(",")));

    return {          // here return the data in the form of object
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
      networkInterfaces: (networkInterfaces || []) // here the deafult is true then it back there ip4 or mac
        .filter((n) => n.default)
        .map((n) => ({
          mac: n.mac,
          ip4: n.ip4,
        })),
      networkStats: (networkStats || []).map((n) => ({ iface: n.iface })), // it give the active network stats
      battery: {
        isCharging: battery?.isCharging || null,
        percent: battery?.percent || null,
      },
      services: (services || []).map((s) => ({name: s.name})), // here you can set for custom for specific at up.
      users: [...new Set((users || []).map((u) => u.user))].map((user) => ({
        user,
      })),
    };
  }

  setInterval(async () => {             // here the set interval is use to send the data to kafka server every 3 seconds
    const data = await collectData();

    await producer.send({
      topic: process.env.TOPIC || "MonitoringSelf",
      messages: [{ key: data.hostname, value: JSON.stringify(data) }],
    });

    console.log("📤 Sent system-defined data for:", data.hostname);
  }, 3000);
}

runProducer().catch(console.error);         // here the run producer function is call to start the producer
                        

// NOTE : Update at 2025-09-28
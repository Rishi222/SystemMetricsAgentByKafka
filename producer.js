                                                    // code 1 (here in this code i send every data given by systeminfromation package . all data in this is not possible to send at once)

// const { Kafka } = require("kafkajs");
// const si = require("systeminformation");

// async function runProducer() {
//   const kafka = new Kafka({
//     clientId: "system-agent",
//     brokers: ["localhost:9092"],
//   });

//   const producer = kafka.producer();
//   await producer.connect();
//   console.log("✅ Producer connected to Kafka");

//   async function collectSystemData() {
//     const safeCall = async (fn) => {
//       try {
//         return await fn();
//       } catch {
//         return null;
//       }
//     };

//     return {
//       timestamp: new Date().toISOString(),
//       hostname: (await safeCall(si.osInfo))?.hostname || "unknown",
//       //   system: await safeCall(si.system),
//       //   osInfo: await safeCall(si.osInfo),
//       //   uuid: await safeCall(si.uuid),
//       //   versions: await safeCall(si.versions),

//       //   cpu: await safeCall(si.cpu),
//       //   cpuCurrentSpeed: await safeCall(si.cpuCurrentSpeed),
//       //   currentLoad: await safeCall(si.currentLoad),
//       //   cpuTemperature: await safeCall(si.cpuTemperature),

//       //   memory: await safeCall(si.mem),
//       //   memLayout: await safeCall(si.memLayout),

//       //   diskLayout: await safeCall(si.diskLayout),
//       //   fsSize: await safeCall(si.fsSize),
//       //   blockDevices: await safeCall(si.blockDevices),
//       //   fsStats: await safeCall(si.fsStats),

//       //   networkInterfaces: await safeCall(si.networkInterfaces),
//       //   networkStats: await safeCall(si.networkStats),
//       //   networkConnections: await safeCall(si.networkConnections),

//       //   battery: await safeCall(si.battery),
//       //   powerSupply: await safeCall(si.powerSupply),

//     //   processes: await safeCall(si.processes),
//     //   services: await safeCall(),
//     //   services: await safeCall(() => si.services("mysql,apache2")),

//         // dockerInfo: await safeCall(si.dockerInfo),
//         // dockerContainers: await safeCall(si.dockerContainers),
//       //   dockerVolumes: await safeCall(si.dockerVolumes),

//         // graphics: await safeCall(si.graphics),
//         // users: await safeCall(si.users),

//         // staticData: await safeCall(si.getStaticData),
//         // dynamicData: await safeCall(si.getDynamicData),
//     };
//   }

//   setInterval(async () => {
//     const data = await collectSystemData();
//     await producer.send({
//       topic: "MonitoringSelf",
//       messages: [{ key: data.hostname, value: JSON.stringify(data) }],
//     });
//     console.log("📤 Sent system data for:", data.hostname);
//   }, 3000);
// }

// runProducer().catch(console.error);


                                                    // code 2 (extract important data from user to send )

require("dotenv").config();          
const { Kafka } = require("kafkajs");
const si = require("systeminformation");

async function runProducer() {
  // const kafka = new Kafka({
  //   clientId: process.env.CLIENT_ID_PRODUCER || "system-agent",
  //   brokers: (process.env.BROKERS || "localhost:9092").split(","),
  // });

  const kafka = new Kafka({
    clientId: "system-agent",
    brokers: ["192.168.29.118:9092"],
    connectionTimeout: 3000,
    requestTimeout: 25000,
    // logLevel: logLevel.INFO,
  });

  const producer = kafka.producer();
  await producer.connect();
  console.log("✅ Producer connected to Kafka");

  const safeCall = async (fn) => {
    try {
      return await fn();
    } catch {
      return null;
    }
  };

  async function collectData() {
    const osInfo = await safeCall(si.osInfo);
    const system = await safeCall(si.system);
    const cpu = await safeCall(si.cpu);
    const mem = await safeCall(si.mem);
    // const memLayout = await safeCall(si.memLayout);
    // const diskLayout = await safeCall(si.diskLayout);
    const networkInterfaces = await safeCall(si.networkInterfaces);
    const networkStats = await safeCall(si.networkStats);
    const battery = await safeCall(si.battery);
    const graphics = await safeCall(si.graphics);
    const users = await safeCall(si.users);
    // const processes = await safeCall(si.processes);
    const servicesList = ["ai_service", "docker", "nginx"];                             // define important services
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
    //   memLayout: memLayout || [], // how many memory installed
    //   diskLayout: diskLayout || [], // similar to memory installed storage
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
    //   graphics: graphics?.controllers || [],             // here i access the grapics info which is typicaly the screen.
      //   users: (users || []).map((u) => ({ user: u.user })),                 // error at here 
      users: [...new Set((users || []).map((u) => u.user))].map((user) => ({
        user,
      })),
    };
  }

  setInterval(async () => {
    const data = await collectData();

    await producer.send({
      topic: process.env.TOPIC || "MonitoringSelf",
      messages: [{ key: data.hostname, value: JSON.stringify(data) }],
    });

    console.log("📤 Sent system-defined data for:", data.hostname);
  }, 3000);
}

runProducer().catch(console.error);
                        
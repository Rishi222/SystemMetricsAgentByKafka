                                                    // code 1 (here in this code this consumer accept all the data from the producer which is nearly impossible to show the data)

// const { Kafka } = require("kafkajs");

// const kafka = new Kafka({
//   clientId: "system-monitor-consumer",
//   brokers: ["localhost:9092"],
// });

// const consumer = kafka.consumer({ groupId: "system-data-group" });

// const run = async () => {
//   await consumer.connect();
//   await consumer.subscribe({ topic: "MonitoringSelf", fromBeginning: true });

//   console.log("✅ Consumer is running...");

//   await consumer.run({
//     eachMessage: async ({ message }) => {
//       try {
//         const data = JSON.parse(message.value.toString());

//         console.log("\n---------------------------------------------------");
//         console.log(`📡 Data from system: ${data.hostname || "unknown"}`);
//         console.log("🕒 Timestamp:", data.timestamp);

//         const safePrint = (label, value) =>
//           console.log(`${label}:`, value ?? "N/A");

//         // safePrint("🖥️ System", data.system);
//         // safePrint("⚙️ OS Info", data.osInfo);
//         // safePrint("🆔 UUIDs", data.uuid);
//         // safePrint("Versions",data.versions);
//         // safePrint("⚡ CPU", data.cpu);
//         // safePrint("CPUcurrentspeed", data.cpuCurrentSpeed);
//         // safePrint("📈 CPU Load", data.currentLoad);
//         // safePrint("🌡️ CPU Temp", data.cpuTemperature);
//         // safePrint("🧠 Memory", data.memory || data.mem);
//         // safePrint("💾 Memory Layout", data.memLayout);
//             // safePrint("💽 Disk Layout", data.diskLayout);
//             // safePrint("📂 File Systems", data.fsSize);
//             // safePrint("BlockDevices",data.blockDevices);
//             // safePrint("fsStats",data.fsStats);
//         // safePrint("🌐 Network Interfaces", data.networkInterfaces);
//         // safePrint("📡 Network Stats", data.networkStats);
//         // safePrint("networkConnections", data.networkConnections);
//         // safePrint("🔌 Active Connections", data.networkConnections);
//         // safePrint("🔋 Battery", data.battery);
//         // safePrint("⚡ Power Supply", data.powerSupply);
//         // safePrint("⚙️ Processes", data.processes);
//         // safePrint("🔧 Services", data.services);
//         // safePrint("🐳 Docker Info", data.dockerInfo);
//         // safePrint("🐳 Docker Containers", data.dockerContainers);
//         // safePrint("🎮 Graphics", data.graphics);
//         // safePrint("👤 Users", data.users);
//         // safePrint("staticData" , data.staticData);
//         // safePrint("dynamicData", data.dynamicData);
//       } catch (err) {
//         console.error("❌ Error parsing message", err);
//       }
//     },
//   });
// };

// run().catch(console.error);


                                                    // code 2 (extract important data from user to send )


const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: process.env.CLIENT_ID_CONSUMER || "system-monitor-consumer",
  brokers: (process.env.BROKERS || "localhost:9092").split(","),
});

const consumer = kafka.consumer({
  groupId: process.env.CONSUMER_GROUP || "defined-monitor-group",
});

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.TOPIC || "MonitoringSelf",
    fromBeginning: true,
  });

  console.log("✅ Consumer running...");

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const data = JSON.parse(message.value.toString());

        const safePrint = (label, value) =>
          console.log(`${label}:`, value ?? "N/A");

        console.log("\n---------------------------------------------------");
        safePrint("📡 Hostname", data.hostname);
        safePrint("🕒 Timestamp", data.timestamp);

        safePrint("🖥️ System", data.system);
        safePrint("💻 OS Info", data.osinfo);
        safePrint("⚡ CPU", data.cpu);
        safePrint("🧠 Memory", data.memory);
        // safePrint("💾 Memory Layout", data.memLayout);
        // safePrint("💽 Disk Layout", data.diskLayout);
        safePrint("🌐 Network Interfaces", data.networkInterfaces);
        safePrint("📡 Network Stats", data.networkStats);
        safePrint("🔋 Battery", data.battery);
        safePrint("🔧 Services", data.services);
        // safePrint("🎮 Graphics", data.graphics);
        safePrint("👤 Users", data.users);
        console.log("---------------------------------------------------\n");
      } catch (err) {
        console.error("❌ Error parsing message", err);
      }
    },
  });
};

run().catch(console.error);

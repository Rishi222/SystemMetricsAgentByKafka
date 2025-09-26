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
        safePrint("🌐 Network Interfaces", data.networkInterfaces);
        safePrint("📡 Network Stats", data.networkStats);
        safePrint("🔋 Battery", data.battery);
        safePrint("🔧 Services", data.services);
        safePrint("👤 Users", data.users);
        console.log("---------------------------------------------------\n");
      } catch (err) {
        console.error("❌ Error parsing message", err);
      }
    },
  });
};

run().catch(console.error);

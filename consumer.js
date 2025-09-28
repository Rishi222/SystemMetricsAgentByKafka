require("dotenv").config();
const { Kafka } = require("kafkajs");
const mongoose = require("mongoose");
const SystemData = require("./models/SystemData");

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Kafka consumer setup
const kafka = new Kafka({
  clientId: process.env.CLIENT_ID_CONSUMER || "system-monitor-consumer",
  brokers: (process.env.BROKERS || "localhost:9092").split(","),
});

// Create a kafka consumer instance
const consumer = kafka.consumer({
  groupId: process.env.CONSUMER_GROUP || "defined-monitor-group",
});

// Function to run the consumer
const run = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.TOPIC || "MonitoringSelf",
    fromBeginning: true,
  });

  // Log that the consumer is running
  console.log("✅ Consumer running...");

  // Process each message received
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

run().catch(console.error);                     // here the run producer function is call to start the producer

// NOTE : Update at 2025-09-28


require("dotenv").config();
const connectDB = require("./config/mongodb");
const kafka = require("./config/kafka");
const SystemData = require("./models/systemData");

// Connect MongoDB
connectDB();

// Create a kafka consumer instance
const consumer = kafka.consumer({ groupId: process.env.CONSUMER_GROUP || "defined-monitor-group" });

// Function to run the consumer
const run = async () => {
  await consumer.connect();       // here first connect the consumer with the kafka server
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

        const safePrint = (label, value) =>               // safe print function is use to print the data in the console if data is not available it print N/A
          console.log(`${label}:`, value ?? "N/A");

        console.log("\n---------------------------------------------------");
        console.log(`📥 Saved/Updated data for host: ${data.hostname}`);

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

        // Save or update system data by hostname
        await SystemData.findOneAndUpdate(
          { hostname: data.hostname },
          { $set: data },
          { upsert: true, new: true }
        );
      } catch (err) {         // here the error is handle if any error occur in parsing the message
        console.error("❌ Error parsing message", err);
      }
    },
  });
};

run().catch(console.error);                     // here the run producer function is call to start the producer

// NOTE : Update at 2025-09-28

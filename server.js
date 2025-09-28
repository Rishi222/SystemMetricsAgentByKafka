// api.js
const express = require("express");
const os = require("os");
const { kafka } = require("./config/kafka.js");

const app = express();
app.use(express.json());

// Create Kafka producer
const producer = kafka.producer();

async function connectProducer() {
  await producer.connect();
  console.log("✅ Kafka Producer connected");
}

connectProducer();

// Helper function to collect system data
function getSystemData() {
  return {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    uptime: os.uptime(),
    cpus: os.cpus().map((cpu) => cpu.model),
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
    },
    timestamp: new Date().toISOString(),
  };
}

// API route → GET system data & send to Kafka
app.get("/send-data", async (req, res) => {
  try {
    const data = getSystemData();
    // Send to Kafka
    await producer.send({
      topic: "system-data",
      messages: [{ value: JSON.stringify(data) }],
    });

    res.json({
      status: "success",
      message: "System data sent to Kafka",
      data,
    });
  } catch (error) {
    console.error("❌ Error sending to Kafka:", error);
    res.status(500).json({ error: "Failed to send data" });
  }
});

app.listen(3000, () => {
  console.log("🚀 API running on http://localhost:3000");
});

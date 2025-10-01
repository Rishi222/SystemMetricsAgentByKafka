const express = require("express");
const kafka = require("./config/kafka");
const getSystemData = require("./utils/getSystemData");
const ipFinder = require("./utils/ipfinder");
require("dotenv").config();        // it is use to load the env file

const app = express();
app.use(express.json());        // thse express json middleware is use to parse the json data

// Create Kafka producer
const producer = kafka.producer();

async function connectProducer() {
  await producer.connect();
  console.log("✅ Kafka Producer connected");
}

connectProducer();

// here the server will receive data from external clients
app.post("/send-data", async (req, res) => {
  try {
    console.log("📩 Raw data from client:", req.body);

    // Validate (basic check)
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "No data provided" });
    }

    // Apply schema
    const SystemData = getSystemData(req.body);

    // Send to Kafka
    await producer.send({
      topic: "MonitoringSelf",
      messages: [{ value: JSON.stringify(SystemData) }],
    });

    console.log("✅ Structured system data sent:", SystemData);

    res.json({
      status: "success",
      message: "Child data sent to Kafka",
      received: SystemData,
    });
  } catch (error) {
    console.error("❌ Error processing child data:", error);
    res.status(500).json({ error: "Failed to process child data" });
  }
});

app.get("/ipinfo", async (req, res) => {
  try {
    const ipInfo = await ipFinder();
    res.json(ipInfo);
  } catch (error) {
    console.error("❌ Error fetching IP info:", error);
    res.status(500).json({ error: "Failed to fetch IP info" });
  }
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 API running on http://localhost:${process.env.PORT || 3000}`);
});
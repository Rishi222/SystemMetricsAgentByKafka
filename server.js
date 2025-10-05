require("dotenv").config(); // it is use to load the env file
const express = require("express");
const kafka = require("./middlewares/kafka");
const getSystemData = require("./utils/getSystemData");
const ipFinder = require("./utils/ipfinder"); // import the ipFinder function

// new dependencies for authentication
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimiter = require("./middlewares/rateLimiter");
const authRoutes = require("./routes/auth");
// const dataRoutes = require("./routes/data");
const sequelize = require("./config/mysqldb");
// const User = require("./models/User");

const app = express();

app.use(helmet());
app.use(express.json()); // thse express json middleware is use to parse the json data
app.use(express.urlencoded({ extended: true })); // this middleware is use to parse the urlencoded data

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true
  })
);
app.use(rateLimiter);

// Create Kafka producer
const producer = kafka.producer();

async function connectProducer() {
  try {
    await producer.connect();
    console.log("✅ Kafka Producer connected");
  } catch (error) {
    console.error("❌ Error connecting Kafka Producer:", error);
  }
}

connectProducer();

async function start() {                      // here this function is use to connect the MySQL database
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Database connected");
    // Sync - in production prefer migrations
    await sequelize.sync({ alter: true }); // or { force: false }
  } catch (err) {
    console.error("❌ Error connecting MySQL Server:", err);
    process.exit(1);
  }
}

// Health check
app.get("/", (req, res) => res.json({ good : true }));

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

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/data", dataRoutes);

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 API running on http://localhost:${process.env.PORT || 3000}`);
});

start();              // here the start function is call to connect the MySQL database
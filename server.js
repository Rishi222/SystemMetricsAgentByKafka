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

// here i add the mongodb connector to this file.
const connectMongoDB = require("./config/mongodb");

// here i add the producer database scheme
const Producer = require("./models/producer");

const app = express();
app.set("trust proxy", true);

// Store connected producers in memory
const connectedProducers = new Map(); // key: ip, value: data

// here i add the port or host.
const PORT = process.env.PORT || 3000;
const HOST = process.env.IP || "0.0.0.0"; 

app.use(helmet());
app.use(express.json()); // thse express json middleware is use to parse the json data
app.use(express.urlencoded({ extended: true })); // this middleware is use to parse the urlencoded data

app.use(cookieParser());

// here update the cors for multiple end points
const allowedOrigins = [process.env.APP_URL, process.env.APP_URL_CONFIG_IP];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// app.options("*", cors());

//i remove this due to error at server side.
// app.use(rateLimiter);

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

connectMongoDB();     // Initialize MongoDB Connection

async function startMySQL() {                      // here this function is use to connect the MySQL database
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Database connected");
    // Sync - in production prefer migrations
    await sequelize.sync({ alter: false }); // or { force: false }
  } catch (err) {
    console.error("❌ Error connecting MySQL Server:", err);
    process.exit(1);
  }
}

// Health check
app.get("/", (req, res) =>  { res.json({
    server: true,
    kafka: producer ? "connected" : "disconnected",
    mysql: sequelize ? "connected" : "disconnected",
    mongodb: "connected", // could add mongoose.connection.readyState check
  });
});

// here the server will receive data from external clients
app.post("/send-data", async (req, res) => {
  try {
    console.log("📩 Raw data from client:", req.body);

    // Validate (basic check)
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "No data provided" });
    }

    // // Apply schema
    // const SystemData = getSystemData(req.body);

    // // Identify the producer (IP-based)
    // const producerIp = req.ip || req.headers["x-forwarded-for"] || "unknown";
    // const { producerId, ...data } = req.body;

    // Format + enrich system data
    const systemData = getSystemData(req.body);
    const producerIp =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.ip ||
      "unknown";

    // Assign a unique producerId
    const producerId =
      req.body.producerId ||
      `${systemData.hostname}_${producerIp.replace(/[.:]/g, "_")}`;

    await Producer.findOneAndUpdate(
      { producerId },
      {
        $set: {
          ip: producerIp,
          hostname: systemData.hostname,
          lastSeen: new Date(),
          systemData,
        },
      },
      { upsert: true, new: true }
    );

    // Save this producer to memory for dashboard view
    connectedProducers.set(producerIp, {
      ip: producerIp,
      hostname: systemData.hostname || "unknown",
      timestamp: new Date().toISOString(),
      data: systemData,
    });

    try {
      await producer.send({
        topic: "MonitoringSelf",
        messages: [{ value: JSON.stringify(systemData) }],
      });
    } catch (err) {
      console.error("⚠️ Failed to send message to Kafka:", err.message);
    }

    console.log(`✅ Producer ${producerIp} connected and data sent to Kafka`);
    // console.log("✅ Structured system data sent:", SystemData);

    res.json({
      status: "success",
      message: "Producer data stored and sent to Kafka",
      // received: SystemData,
      received : {producerId, ...systemData },
    });
  } catch (error) {
    console.error("❌ Error processing producer data:", error.message);
    res.status(500).json({ error: "Failed to process producer data" });
  }
});

// This endpoint returns currently connected producers (for Consumer Dashboard)
// app.get("/connected-producers", (req, res) => {
app.get("/producers", async (req, res) => {
  try {
    // const producers = Array.from(connectedProducers.values());
    const producers = await Producer.find({});
    res.json({ total: producers.length , connected: producers });
  } catch (error) {
    // res.status(500).json({ error: "Failed to fetch connected producers" });
    res.status(500).json({ error: "Failed to fetch producer list" });
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
app.listen( PORT , HOST ,() => {
  console.log(`🚀 API running on http://${HOST}:${PORT}`);
});

startMySQL();              // here the startMySQL function is call to connect the MySQL database
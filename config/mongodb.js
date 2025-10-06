const mongoose = require("mongoose");               

async function connectDB() {                     // here the connect db function is use to connect the mongo db with the application
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Database Connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

module.exports = connectDB;

// here this file is use to connect the mongo db with the application.
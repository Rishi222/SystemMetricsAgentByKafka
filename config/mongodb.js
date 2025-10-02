const mongoose = require("mongoose");               

const connectDB = async () => {                     // here the connect db function is use to connect the mongo db with the application
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;

// here this file is use to connect the mongo db with the application.
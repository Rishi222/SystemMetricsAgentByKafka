const mongoose = require("mongoose");

const systemDataSchema = new mongoose.Schema(
  {
    hostname: { type: String, unique: true, required: true },
    timestamp: String,
    system: {
      manufacturer: String,
      model: String,
      version: String,
      type: String,
    },
    osinfo: {
      platform: String,
      distro: String,
      codename: String,
    },
    cpu: {
      manufacturer: String,
      brand: String,
      cores: Number,
    },
    memory: {
      total: Number,
      free: Number,
      used: Number,
    },
    networkInterfaces: [
      {
        mac: String,
        ip4: String,
      },
    ],
    networkStats: [
      {
        iface: String,
      },
    ],
    battery: {
      isCharging: Boolean,
      percent: Number,
    },
    services: [{ name: String }],
    users: [{ user: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SystemData", systemDataSchema);


// here this is the schema for the mongo db to store the data from the producer.js in the database.
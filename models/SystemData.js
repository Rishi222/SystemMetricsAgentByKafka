const mongoose = require("mongoose");

const systemDataSchema = new mongoose.Schema(
  {
    hostname: { type: String, unique: true, required: true },
    timestamp: String,

    system: {
      manufacturer: { type: String },
      model: { type: String },
      version: { type: String },
      type: { type: String },
    },

    osinfo: {
      platform: { type: String },
      distro: { type: String },
      codename: { type: String },
    },

    cpu: {
      manufacturer: { type: String },
      brand: { type: String },
      cores: { type: Number },
    },

    memory: {
      total: { type: Number },
      free: { type: Number },
      used: { type: Number },
    },

    networkInterfaces: [
      {
        mac: { type: String },
        ip4: { type: String },
      },
    ],

    networkStats: [
      {
        iface: { type: String },
      },
    ],

    battery: {
      isCharging: { type: Boolean , default:null },
      percent: { type: Number , default:null },
    },

    services: [{ name: { type: String } }],
    users: [{ user: { type: String } }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SystemData", systemDataSchema);


// here this is the schema for the mongo db to store the data from the producer.js in the database.
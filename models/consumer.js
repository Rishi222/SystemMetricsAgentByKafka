const mongoose = require("mongoose");

const consumerDataSchema = new mongoose.Schema(
  {
    producerId: { type: String, required: false },
    hostname: { type: String, required: true },
    timestamp: { type: String, default: Date.now },

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
      isCharging: { type: Boolean, default: null },
      percent: { type: Number, default: null },
    },
    services: [
      {
        name: { type: String },
      },
    ],
    users: [
      {
        user: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ConsumerData", consumerDataSchema);

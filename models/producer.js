// models/Producer.js
const mongoose = require("mongoose");

const producerSchema = new mongoose.Schema({
  producerId: { type: String, required: true, unique: true },
  ip: String,
  hostname: String,
  lastSeen: { type: Date, default: Date.now },
  systemData: Object, // last system data snapshot
});

module.exports = mongoose.model("Producer", producerSchema);
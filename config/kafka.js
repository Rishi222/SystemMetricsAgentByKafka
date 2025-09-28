const { Kafka } = require("kafkajs");

// Kafka consumer setup
const kafka = new Kafka({
  clientId: process.env.CLIENT_ID_CONSUMER || "system-monitor-consumer",
  brokers: (process.env.BROKERS || "localhost:9092").split(","),
});

module.exports = kafka;

// NOTE : update at 2025-09-28
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  operation: { type: String, required: true }, // Name of the operation
  entity: { type: String, required: true }, // Entity involved (Subscriber, Stats, etc.)
  entityId: { type: mongoose.Schema.Types.ObjectId, refPath: "entity" }, // ID of the entity
  details: { type: Object }, // Additional details
  timestamp: { type: Date, default: Date.now }, // Timestamp of the operation
});

module.exports = mongoose.model("Log", logSchema);

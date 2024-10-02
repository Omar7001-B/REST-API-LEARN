const mongoose = require("mongoose");

const managerLogSchema = new mongoose.Schema({
  operation: {
    type: String,
    required: true,
  },
  entityType: {
    type: String,
    required: true,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  details: {
    type: Object,
    required: true,
  },
  publicIp: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ManagerLog", managerLogSchema);

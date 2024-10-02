const mongoose = require("mongoose");

const managerLogSchema = new mongoose.Schema({
  operation: {
    type: String,
  },
  entityType: {
    type: String,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  details: {
    type: Object,
  },
  publicIp: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ManagerLog", managerLogSchema);

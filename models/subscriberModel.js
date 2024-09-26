const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Subscriber", subscriberSchema);

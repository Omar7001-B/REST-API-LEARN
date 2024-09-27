const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
    default: Date.now, // You may want to set this to a specific date or duration
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"], // Changed to start with uppercase letters
    default: "Active", // Default status
  },
  publicIps: {
    type: [String], // Array of public IP addresses
    default: [], // Default to an empty array
  },
});

module.exports = mongoose.model("Subscriber", subscriberSchema);

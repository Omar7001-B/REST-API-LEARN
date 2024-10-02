const express = require("express");
const Log = require("../models/logModel.js");
const router = express.Router();

// Get all logs
router.get("/", async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete all logs
router.delete("/delete-all", async (req, res) => {
  try {
    const result = await Log.deleteMany(); // Delete all logs
    res.json({ message: "All logs deleted", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

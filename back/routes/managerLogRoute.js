const express = require("express");
const ManagerLog = require("../models/managerLogModel.js"); // Ensure to create this model
const router = express.Router();

// Get all manager logs
router.get("/", async (req, res) => {
  try {
    const managerLogs = await ManagerLog.find().sort({ timestamp: -1 });
    res.json(managerLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete all manager logs
router.delete("/delete-all", async (req, res) => {
  try {
    const result = await ManagerLog.deleteMany(); // Delete all manager logs
    res.json({ message: "All manager logs deleted", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

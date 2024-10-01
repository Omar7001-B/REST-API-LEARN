const express = require("express");
const router = express.Router();
const Stats = require("../models/statsModel");

// Middleware to get stats by username
async function getStatsByUsername(req, res, next) {
  let stats;
  try {
    stats = await Stats.findOne({ username: req.params.username });
    if (stats == null) {
      return res.status(404).json({ message: "Stats not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.stats = stats;
  next();
}

// Get all stats
router.get("/", async (req, res) => {
  try {
    const stats = await Stats.find();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get stats by username
router.get("/:username", getStatsByUsername, (req, res) => {
  res.json(res.stats);
});

// Create new stats (username must be unique)
router.post("/", async (req, res) => {
  const statsExists = await Stats.findOne({ username: req.body.username });
  if (statsExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const stats = new Stats({
    farmingStats: req.body.farmingStats || {},
    itemStats: req.body.itemStats || {},
    gearStats: req.body.gearStats || {},
    username: req.body.username,
  });

  try {
    const newStats = await stats.save();
    res.status(201).json(newStats);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update stats by username (partial update)
router.patch("/:username", getStatsByUsername, async (req, res) => {
  if (req.body.farmingStats != null) {
    res.stats.farmingStats = req.body.farmingStats;
  }
  if (req.body.itemStats != null) {
    res.stats.itemStats = req.body.itemStats;
  }
  if (req.body.gearStats != null) {
    res.stats.gearStats = req.body.gearStats;
  }

  try {
    const updatedStats = await res.stats.save();
    res.json(updatedStats);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete stats by username
router.delete("/:username", getStatsByUsername, async (req, res) => {
  try {
    await Stats.deleteOne({ username: req.params.username });
    res.json({ message: "Stats deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

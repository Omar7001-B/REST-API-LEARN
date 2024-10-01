const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscriberModel");
const Stats = require("../models/statsModel");
const ModInfo = require("../models/modInfoModel");

// Function to update public IPs for a subscriber
async function updatePublicIP(username, ip) {
  try {
    const subscriber = await Subscriber.findOne({ username });
    if (subscriber) {
      if (!subscriber.publicIps.includes(ip)) {
        subscriber.publicIps.push(ip); // Add new IP if it doesn't exist
        await subscriber.save(); // Save changes
      }
    }
  } catch (err) {
    console.error("Error updating public IP:", err.message);
  }
}

// Middleware to get subscriber data along with mod info
async function getSubscriberData(req, res) {
  const username = req.params.username; // Get username from URL
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress; // Get IP from headers

  await updatePublicIP(username, ip); // Update the public IP for the subscriber

  try {
    const subscriber = await Subscriber.findOne({ username });
    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    // Fetch mod info
    const modInfo = await ModInfo.findOne();
    if (!modInfo) {
      return res.status(404).json({ message: "Mod info not found" });
    }

    // Return subscriber data without public IPs and include mod info
    const { publicIps, ...subscriberData } = subscriber.toObject();
    res.json({ subscriber: subscriberData, modInfo }); // Send both subscriber and mod info
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Endpoint to get user data along with mod info
router.get("/subscriber/:username", getSubscriberData);

// Endpoint to add/update user stats
router.post("/stats/:username", async (req, res) => {
  const username = req.params.username; // Get username from URL
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress; // Get IP from headers

  await updatePublicIP(username, ip); // Update the public IP for the subscriber

  try {
    const statsExists = await Stats.findOne({ username });

    if (statsExists) {
      // Update stats if it already exists
      Object.assign(statsExists, req.body); // Update with the request body
      const updatedStats = await statsExists.save();
      return res.status(200).json(updatedStats);
    } else {
      // Create new stats if it doesn't exist
      const stats = new Stats({ username, ...req.body });
      const newStats = await stats.save();
      return res.status(201).json(newStats);
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = router;

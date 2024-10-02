const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscriberModel");
const Stats = require("../models/statsModel");
const ModInfo = require("../models/modInfoModel");
const { logOperation } = require("../controllers/logController"); // Import log controller

// Function to update public IPs for a subscriber
async function updatePublicIP(username, ip) {
  try {
    // Find the subscriber by username
    let subscriber = await Subscriber.findOne({ username });

    // If the subscriber doesn't exist, create a new one
    if (!subscriber) {
      subscriber = new Subscriber({
        username,
        publicIps: [ip], // Add the IP to the new subscriber's public IPs
        status: "Inactive", // Set status to Inactive
        expirationDate: new Date(), // Set expiration date to now or customize
      });

      await subscriber.save(); // Save the new subscriber

      // Log the creation operation
      logOperation("createSubscriber", "Subscriber", subscriber._id, {
        username,
        ip,
        publicIps: subscriber.publicIps,
        status: subscriber.status,
      });
    } else {
      // If the subscriber exists, update their public IPs
      if (!subscriber.publicIps.includes(ip)) {
        subscriber.publicIps.push(ip); // Add new IP if it doesn't exist
        await subscriber.save(); // Save changes

        // Log the update operation
        logOperation("updatePublicIP", "Subscriber", subscriber._id, {
          username,
          ip,
          publicIps: subscriber.publicIps,
        });
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
    // Try to find the subscriber by username
    let subscriber = await Subscriber.findOne({ username });

    // If the subscriber is not found, create a new one
    if (!subscriber) {
      subscriber = new Subscriber({
        username,
        publicIps: [ip], // Add the IP to the new subscriber's public IPs
        status: "Inactive", // Set status to Inactive
        expirationDate: new Date(), // Set expiration date to now or customize
      });

      await subscriber.save(); // Save the new subscriber

      // Log the creation operation
      logOperation("createSubscriber", "Subscriber", subscriber._id, {
        username,
        ip,
        publicIps: subscriber.publicIps,
        status: subscriber.status,
      });
    }

    // Fetch mod info
    const modInfo = await ModInfo.findOne();
    if (!modInfo) {
      logOperation("getSubscriberData", "ModInfo", null, {
        message: "Mod info not found",
      });
      return res.status(404).json({ message: "Mod info not found" });
    }

    // Return subscriber data without public IPs and include mod info
    const { publicIps, ...subscriberData } = subscriber.toObject();

    // Log the data retrieval operation
    logOperation("getSubscriberData", "Subscriber", subscriber._id, {
      subscriber: subscriberData,
      modInfo,
    });

    res.json({ subscriber: subscriberData, modInfo }); // Send both subscriber and mod info
  } catch (err) {
    logOperation("getSubscriberData", "Error", null, { message: err.message });
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

      // Log the update stats operation
      logOperation("updateStats", "Stats", statsExists._id, {
        username,
        updatedStats,
      });

      return res.status(200).json(updatedStats);
    } else {
      // Create new stats if it doesn't exist
      const stats = new Stats({ username, ...req.body });
      const newStats = await stats.save();

      // Log the creation of new stats
      logOperation("createStats", "Stats", stats._id, { username, newStats });

      return res.status(201).json(newStats);
    }
  } catch (err) {
    logOperation("updateStats", "Error", null, { message: err.message });
    return res.status(400).json({ message: err.message });
  }
});

module.exports = router;

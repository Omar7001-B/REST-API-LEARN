const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscriberModel");
const { logOperation } = require("../controllers/managerLogController"); // Import the log function

// Middleware to get subscriber by username
async function getSubscriberByUsername(req, res, next) {
  let subscriber;
  try {
    subscriber = await Subscriber.findOne({ username: req.params.username });
    if (subscriber == null) {
      return res.status(404).json({ message: "Subscriber not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.subscriber = subscriber;
  next();
}

// Getting all subscribers
router.get("/", async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress; // Get the public IP
  try {
    const subscribers = await Subscriber.find();
    // Log the operation
    await logOperation(
      "GET",
      "Subscriber",
      null,
      "Fetched all subscribers",
      ip
    );
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one subscriber by username
router.get("/:username", getSubscriberByUsername, async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress; // Get the public IP
  // Log the operation
  await logOperation(
    "GET",
    "Subscriber",
    req.params.username,
    "Fetched subscriber details",
    ip
  );
  res.json(res.subscriber);
});

// Creating a new subscriber (username must be unique)
router.post("/", async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress; // Get the public IP
  const subscriberExists = await Subscriber.findOne({
    username: req.body.username,
  });
  if (subscriberExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const subscriber = new Subscriber({
    username: req.body.username,
    expirationDate: req.body.expirationDate,
    publicIps: req.body.publicIps, // Include public IPs if provided
    status: req.body.status.charAt(0).toUpperCase() + req.body.status.slice(1), // Ensure status is capitalized
  });

  try {
    const newSubscriber = await subscriber.save();
    // Log the operation
    await logOperation(
      "CREATE",
      "Subscriber",
      newSubscriber.username,
      "Created new subscriber",
      ip
    );
    res.status(201).json(newSubscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating a subscriber by username (partial update)
router.patch("/:username", getSubscriberByUsername, async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress; // Get the public IP
  if (req.body.username != null) {
    res.subscriber.username = req.body.username;
  }
  if (req.body.expirationDate != null) {
    res.subscriber.expirationDate = req.body.expirationDate;
  }
  if (req.body.status != null) {
    res.subscriber.status =
      req.body.status.charAt(0).toUpperCase() + req.body.status.slice(1); // Update status if provided and ensure it's capitalized
  }
  if (req.body.publicIps != null) {
    res.subscriber.publicIps = req.body.publicIps; // Update public IPs if provided
  }

  try {
    const updatedSubscriber = await res.subscriber.save();
    // Log the operation
    await logOperation(
      "UPDATE",
      "Subscriber",
      updatedSubscriber.username,
      "Updated subscriber details",
      ip
    );
    res.json(updatedSubscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting a subscriber by username
router.delete("/:username", getSubscriberByUsername, async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress; // Get the public IP
  try {
    await Subscriber.deleteOne({ username: req.params.username });
    // Log the operation
    await logOperation(
      "DELETE",
      "Subscriber",
      req.params.username,
      "Deleted subscriber",
      ip
    );
    res.json({ message: "Subscriber deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

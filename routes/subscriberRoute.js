const express = require("express");
const router = express.Router();

const Subscriber = require("../models/subscriberModel");

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
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one subscriber by username
router.get("/:username", getSubscriberByUsername, (req, res) => {
  res.json(res.subscriber);
});

// Creating a new subscriber (username must be unique)
router.post("/", async (req, res) => {
  const subscriberExists = await Subscriber.findOne({
    username: req.body.username,
  });
  if (subscriberExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const subscriber = new Subscriber({
    username: req.body.username,
    expirationDate: req.body.expirationDate,
  });

  try {
    const newSubscriber = await subscriber.save();
    res.status(201).json(newSubscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating a subscriber by username (partial update)
router.patch("/:username", getSubscriberByUsername, async (req, res) => {
  if (req.body.username != null) {
    res.subscriber.username = req.body.username;
  }
  if (req.body.expirationDate != null) {
    res.subscriber.expirationDate = req.body.expirationDate;
  }

  try {
    const updatedSubscriber = await res.subscriber.save();
    res.json(updatedSubscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting a subscriber by username
router.delete("/:username", getSubscriberByUsername, async (req, res) => {
  try {
    await Subscriber.deleteOne({ username: req.params.username });
    res.json({ message: "Subscriber deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Test endpoint
router.get("/test", (req, res) => {
  res.json({ message: "Test endpoint" });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const ModInfo = require("../models/modInfoModel");

// Middleware to get mod info
async function getModInfo(req, res, next) {
  try {
    const modInfo = await ModInfo.findOne(); // There will be only one mod info document
    if (!modInfo) {
      return res.status(404).json({ message: "Mod Info not found" });
    }
    res.modInfo = modInfo; // Store found modInfo in the response object for later use
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Getting the mod info (there's only one)
router.get("/", getModInfo, (req, res) => {
  res.json(res.modInfo);
});

// Updating the mod info (partial update)
router.patch("/", getModInfo, async (req, res) => {
  // Update each field if provided
  if (req.body.version !== undefined) {
    res.modInfo.version = req.body.version;
  }
  if (req.body.updateAvailable !== undefined) {
    res.modInfo.updateAvailable = req.body.updateAvailable;
  }
  if (req.body.discordLink !== undefined) {
    res.modInfo.discordLink = req.body.discordLink;
  }
  if (req.body.activeAllUsers !== undefined) {
    res.modInfo.activeAllUsers = req.body.activeAllUsers;
  }
  if (req.body.disableAllUsers !== undefined) {
    res.modInfo.disableAllUsers = req.body.disableAllUsers;
  }
  if (req.body.featureToggles !== undefined) {
    res.modInfo.featureToggles = {
      ...res.modInfo.featureToggles,
      ...req.body.featureToggles,
    };
  }

  try {
    const updatedModInfo = await res.modInfo.save(); // Save updated document
    res.json(updatedModInfo); // Return the updated document
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to initialize mod info
router.post("/init", async (req, res) => {
  try {
    // Check if the document already exists
    const existingModInfo = await ModInfo.findOne();
    if (existingModInfo) {
      return res.status(400).json({ message: "Mod info already exists." });
    }

    // Create the first document
    const modInfo = new ModInfo(req.body);
    await modInfo.save(); // Save the new document

    res.status(201).json(modInfo); // Return the created document
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

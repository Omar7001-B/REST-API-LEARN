const express = require("express");
const router = express.Router();
const ModInfo = require("../models/modInfoModel");
const { logOperation } = require("../controllers/managerLogController"); // Import logOperation from the new controller

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
router.get("/", getModInfo, async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress; // Get the public IP
  res.json(res.modInfo);

  // Log the operation
  await logOperation(
    "getModInfo",
    "ModInfo",
    res.modInfo._id,
    { modInfo: res.modInfo },
    ip
  );
});

// Updating the mod info (partial update)
router.patch("/", getModInfo, async (req, res) => {
  // Update each field if provided
  if (req.body.version !== undefined) {
    res.modInfo.version = req.body.version;
  }
  if (req.body.discordLink !== undefined) {
    res.modInfo.discordLink = req.body.discordLink;
  }
  if (req.body.enableAllUsers !== undefined) {
    res.modInfo.enableAllUsers = req.body.enableAllUsers;
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
  if (req.body.dataSyncOptions !== undefined) {
    res.modInfo.dataSyncOptions = {
      ...res.modInfo.dataSyncOptions,
      ...req.body.dataSyncOptions,
    };
  }
  if (req.body.userValidationOptions !== undefined) {
    res.modInfo.userValidationOptions = {
      ...res.modInfo.userValidationOptions,
      ...req.body.userValidationOptions,
    };
  }

  try {
    const updatedModInfo = await res.modInfo.save(); // Save updated document
    res.json(updatedModInfo); // Return the updated document

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress; // Get the public IP
    await logOperation(
      "updateModInfo",
      "ModInfo",
      updatedModInfo._id,
      { modInfo: updatedModInfo },
      ip
    );
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

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress; // Get the public IP
    await logOperation("initModInfo", "ModInfo", modInfo._id, { modInfo }, ip);

    res.status(201).json(modInfo); // Return the created document
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

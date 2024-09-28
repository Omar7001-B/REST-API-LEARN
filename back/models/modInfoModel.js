const mongoose = require("mongoose");

const modInfoSchema = new mongoose.Schema({
  version: {
    type: String,
    required: true,
  },
  updateAvailable: {
    type: Boolean,
    required: true,
  },
  discordLink: {
    type: String,
    required: true,
  },
  activeAllUsers: {
    type: Boolean,
    required: true,
  },
  disableAllUsers: {
    type: Boolean,
    required: true,
  },
  featureToggles: {
    enableFarming: { type: Boolean, required: true },
    enableBuyItems: { type: Boolean, required: true },
    enableBuyGears: { type: Boolean, required: true },
    enableSaveInventory: { type: Boolean, required: true },
    enableCompleteInventory: { type: Boolean, required: true },
  },
});

module.exports = mongoose.model("ModInfo", modInfoSchema);

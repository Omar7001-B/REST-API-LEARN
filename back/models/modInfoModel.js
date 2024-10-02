const mongoose = require("mongoose");

const modInfoSchema = new mongoose.Schema({
  version: {
    type: String,
    required: true,
  },
  discordLink: {
    type: String,
    required: true,
  },
  enableAllUsers: {
    type: Boolean,
    required: true,
  },
  disableAllUsers: {
    type: Boolean,
    required: true,
  },
  featureToggles: {
    farming: { type: Boolean, required: true },
    buyItems: { type: Boolean, required: true },
    buyGear: { type: Boolean, required: true },
    statistics: { type: Boolean, required: true },
    saveInventory: { type: Boolean, required: true },
    recoverInventory: { type: Boolean, required: true },
    sendInventory: { type: Boolean, required: true },
    completeInventory: { type: Boolean, required: true },
  },
  dataSyncOptions: {
    onGameOpenClose: { type: Boolean, required: true }, // Sync on game open/close
    onModScreenOpen: { type: Boolean, required: true }, // Sync on mod screen open
    afterCycle: { type: Boolean, required: true }, // Sync after each cycle
    afterOperation: { type: Boolean, required: true }, // Sync after every operation
  },
  userValidationOptions: {
    onGameStart: { type: Boolean, required: true }, // Validate user on game start
    onScreenOpen: { type: Boolean, required: true }, // Validate user on any screen open
    afterCycle: { type: Boolean, required: true }, // Validate user after each cycle
    afterOperation: { type: Boolean, required: true }, // Validate user after every operation
  },
});

module.exports = mongoose.model("ModInfo", modInfoSchema);

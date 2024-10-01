const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  farmingStats: {
    type: Map,
    of: Number,
    default: {},
  },
  itemStats: {
    type: Map,
    of: Number,
    default: {},
  },
  gearStats: {
    type: Map,
    of: Number,
    default: {},
  },
  username: {
    type: String,
    required: true,
  },
});

const Stats = mongoose.model("Stats", statsSchema);

module.exports = Stats;

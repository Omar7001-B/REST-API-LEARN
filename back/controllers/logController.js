const Log = require("../models/logModel"); // Log model

// Function to log operations
async function logOperation(operation, entity, entityId, details) {
  try {
    const logEntry = new Log({
      operation, // e.g., 'updatePublicIP', 'getSubscriberData'
      entity, // e.g., 'Subscriber', 'Stats'
      entityId, // e.g., subscriber._id or null
      details, // Additional details like IP, username, etc.
      timestamp: new Date(), // Current timestamp
    });

    await logEntry.save(); // Save the log entry to the database
  } catch (err) {
    console.error("Error logging operation:", err.message);
  }
}

module.exports = { logOperation };

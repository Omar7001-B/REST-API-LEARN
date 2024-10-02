const ManagerLog = require("../models/managerLogModel");

/**
 * Logs an operation to the ManagerLog model.
 * @param {string} operation - The name of the operation being logged.
 * @param {string} entityType - The type of entity involved in the operation.
 * @param {ObjectId} entityId - The ID of the entity involved in the operation.
 * @param {Object} details - Additional details about the operation.
 * @param {string} publicIp - The public IP address from which the operation was performed.
 */
async function logOperation(
  operation,
  entityType,
  entityId,
  details,
  publicIp
) {
  const logEntry = new ManagerLog({
    operation,
    entityType,
    entityId,
    details,
    publicIp,
  });

  await logEntry.save(); // Save the log entry
}

module.exports = { logOperation };

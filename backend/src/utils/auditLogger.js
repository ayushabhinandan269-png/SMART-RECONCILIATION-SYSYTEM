import AuditLog from "../models/AuditLog.js";

export const createAuditLog = async ({
  entityType,
  entityId,
  oldValue,
  newValue,
  userId,
  source = "system"
}) => {
  await AuditLog.create({
    entityType,
    entityId,
    oldValue,
    newValue,
    userId,
    source,
    timestamp: new Date()
  });
};

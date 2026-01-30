import AuditLog from "../models/AuditLog.js";

export const getRecordTimeline = async (recordId) => {
  const timeline = await AuditLog.find({
    entityType: "Record",
    entityId: recordId
  }).sort({ timestamp: 1 });

  return timeline;
};

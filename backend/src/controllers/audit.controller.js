import AuditLog from "../models/AuditLog.js";

/**
 * GET all audit logs (for Audit Logs page)
 */
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .sort({ timestamp: -1 })
      .limit(200); // safety limit

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET timeline for a specific record
 */
export const getRecordTimeline = async (recordId) => {
  const timeline = await AuditLog.find({
    entityType: "Record",
    entityId: recordId,
  }).sort({ timestamp: 1 });

  return timeline;
};

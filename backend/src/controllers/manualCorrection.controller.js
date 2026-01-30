import Record from "../models/Record.js";
import ReconciliationResult from "../models/ReconciliationResult.js";
import { createAuditLog } from "../utils/auditLogger.js";
import { runReconciliation } from "./reconciliation.controller.js";

export const manualCorrectRecord = async (
  recordId,
  updatedFields,
  userId
) => {
  const record = await Record.findById(recordId);
  if (!record) {
    throw new Error("Record not found");
  }

  const oldValue = {
    amount: record.amount,
    referenceNumber: record.referenceNumber,
    date: record.date
  };

  // 🔧 apply updates
  Object.keys(updatedFields).forEach((key) => {
    record[key] = updatedFields[key];
  });

  await record.save();

  // 🧹 remove old reconciliation result
  await ReconciliationResult.deleteMany({ recordId });

  // 📝 audit log (IMMUTABLE)
  await createAuditLog({
    entityType: "Record",
    entityId: recordId,
    oldValue,
    newValue: updatedFields,
    userId,
    source: "manual"
  });

  // 🔁 AUTO re-reconcile upload job
  await runReconciliation(record.uploadJobId);

  return record;
};

import Record from "../models/Record.js";
import ReconciliationResult from "../models/ReconciliationResult.js";
import { createAuditLog } from "../utils/auditLogger.js";
import MatchingRule from "../models/MatchingRule.js";

export const runReconciliation = async (uploadJobId) => {
  const records = await Record.find({ uploadJobId });

  // ✅ Load configurable rule (fallback if none exists)
  const rule =
    (await MatchingRule.findOne({ enabled: true })) || {
      exactMatchFields: ["transactionId", "amount"],
      partialMatch: {
        referenceField: "referenceNumber",
        amountVariancePercent: 2
      }
    };

  const transactionMap = new Map();

  for (const record of records) {
    // 🔁 Duplicate check (unchanged)
    if (transactionMap.has(record.transactionId)) {
      await ReconciliationResult.create({
        recordId: record._id,
        uploadJobId,
        matchStatus: "Duplicate",
        matchedRecordId: transactionMap.get(record.transactionId)._id
      });

      await createAuditLog({
        entityType: "Record",
        entityId: record._id,
        oldValue: null,
        newValue: { matchStatus: "Duplicate" },
        userId: "system",
        source: "system"
      });

      continue;
    }

    transactionMap.set(record.transactionId, record);

    // 🔍 Exact match (unchanged logic, rule-ready)
    const exactMatch = records.find(
      (r) =>
        r._id.toString() !== record._id.toString() &&
        r.transactionId === record.transactionId &&
        r.amount === record.amount
    );

    if (exactMatch) {
      await ReconciliationResult.create({
        recordId: record._id,
        uploadJobId,
        matchStatus: "Matched",
        matchedRecordId: exactMatch._id
      });

      await createAuditLog({
        entityType: "Record",
        entityId: record._id,
        oldValue: null,
        newValue: { matchStatus: "Matched" },
        userId: "system",
        source: "system"
      });

      continue;
    }

    // 🟡 Partial match (NOW CONFIGURABLE)
    const partialMatch = records.find((r) => {
      if (
        r[rule.partialMatch.referenceField] !==
        record[rule.partialMatch.referenceField]
      )
        return false;

      const variance = rule.partialMatch.amountVariancePercent / 100;
      const diff = Math.abs(r.amount - record.amount);

      return diff / record.amount <= variance;
    });

    if (partialMatch) {
      await ReconciliationResult.create({
        recordId: record._id,
        uploadJobId,
        matchStatus: "Partially Matched",
        matchedRecordId: partialMatch._id,
        mismatchFields: ["amount"]
      });

      await createAuditLog({
        entityType: "Record",
        entityId: record._id,
        oldValue: null,
        newValue: { matchStatus: "Partially Matched" },
        userId: "system",
        source: "system"
      });

      continue;
    }

    // ❌ Unmatched (unchanged)
    await ReconciliationResult.create({
      recordId: record._id,
      uploadJobId,
      matchStatus: "Unmatched"
    });

    await createAuditLog({
      entityType: "Record",
      entityId: record._id,
      oldValue: null,
      newValue: { matchStatus: "Unmatched" },
      userId: "system",
      source: "system"
    });
  }
};



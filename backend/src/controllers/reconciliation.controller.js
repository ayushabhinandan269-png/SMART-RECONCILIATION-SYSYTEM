import Record from "../models/Record.js";
import ReconciliationResult from "../models/ReconciliationResult.js";
import { createAuditLog } from "../utils/auditLogger.js";
import MatchingRule from "../models/MatchingRule.js";

/* ============================
   MAIN RECONCILIATION ENGINE
============================ */

export const runReconciliation = async (uploadJobId) => {
  const records = await Record.find({ uploadJobId });

  const rule =
    (await MatchingRule.findOne({ enabled: true })) || {
      exactMatchFields: ["transactionId", "amount"],
      partialMatch: {
        referenceField: "referenceNumber",
        amountVariancePercent: 2,
      },
    };

  const transactionMap = new Map();

  for (const record of records) {
    // 🔁 Duplicate
    if (transactionMap.has(record.transactionId)) {
      await ReconciliationResult.create({
        recordId: record._id,
        uploadJobId,
        matchStatus: "Duplicate",
        matchedRecordId: transactionMap.get(record.transactionId)._id,
      });

      await createAuditLog({
        entityType: "Record",
        entityId: record._id,
        oldValue: null,
        newValue: { matchStatus: "Duplicate" },
        userId: "system",
        source: "system",
      });

      continue;
    }

    transactionMap.set(record.transactionId, record);

    // 🔍 Exact match
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
        matchedRecordId: exactMatch._id,
      });

      await createAuditLog({
        entityType: "Record",
        entityId: record._id,
        oldValue: null,
        newValue: { matchStatus: "Matched" },
        userId: "system",
        source: "system",
      });

      continue;
    }

    // 🟡 Partial match
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
        mismatchFields: ["amount"],
      });

      await createAuditLog({
        entityType: "Record",
        entityId: record._id,
        oldValue: null,
        newValue: { matchStatus: "Partially Matched" },
        userId: "system",
        source: "system",
      });

      continue;
    }

    // ❌ Unmatched
    await ReconciliationResult.create({
      recordId: record._id,
      uploadJobId,
      matchStatus: "Unmatched",
    });

    await createAuditLog({
      entityType: "Record",
      entityId: record._id,
      oldValue: null,
      newValue: { matchStatus: "Unmatched" },
      userId: "system",
      source: "system",
    });
  }
};

/* ============================
   API: GET RESULTS
============================ */

export const getReconciliationResults = async (req, res) => {
  try {
    const { uploadJobId } = req.params;

    const results = await ReconciliationResult.find({ uploadJobId }).populate(
      "recordId"
    );

    return res.json(results);
  } catch (err) {
    console.error("Fetch reconciliation error:", err);
    return res.status(500).json({ message: err.message });
  }
};

/* ============================
   API: MANUAL CORRECTION
============================ */

export const updateReconciliationRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const oldRecord = await ReconciliationResult.findById(id);
    if (!oldRecord) {
      return res.status(404).json({ message: "Record not found" });
    }

    const updated = await ReconciliationResult.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    // ✅ Audit log for manual correction
    await createAuditLog({
      entityType: "ReconciliationResult",
      entityId: updated._id,
      oldValue: oldRecord,
      newValue: updated,
      userId: req.user._id,
      source: "manual",
    });

    return res.json(updated);
  } catch (err) {
    console.error("Manual update error:", err);
    return res.status(500).json({ message: err.message });
  }
};



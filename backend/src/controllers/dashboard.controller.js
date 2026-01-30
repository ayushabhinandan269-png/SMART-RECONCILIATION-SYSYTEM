import mongoose from "mongoose";
import Record from "../models/Record.js";
import ReconciliationResult from "../models/ReconciliationResult.js";

export const getDashboardStats = async (req, res) => {
  try {
    const uploadJobId = req.params.uploadJobId.trim();

    if (!mongoose.Types.ObjectId.isValid(uploadJobId)) {
      return res.status(400).json({ message: "Invalid uploadJobId" });
    }

    const jobObjectId = new mongoose.Types.ObjectId(uploadJobId);

    // ✅ Total records uploaded
    const total = await Record.countDocuments({ uploadJobId: jobObjectId });

    // ✅ Aggregate reconciliation results
    const aggregation = await ReconciliationResult.aggregate([
      { $match: { uploadJobId: jobObjectId } },
      {
        $group: {
          _id: "$matchStatus",
          count: { $sum: 1 }
        }
      }
    ]);

    // ✅ Initialize stats
    const stats = {
      total,
      matched: 0,
      partiallyMatched: 0,
      unmatched: 0,
      duplicate: 0,
      accuracy: 0
    };

    // ✅ Map aggregation safely
    for (const item of aggregation) {
      if (item._id === "Matched") stats.matched = item.count;
      if (item._id === "Partially Matched") stats.partiallyMatched = item.count;
      if (item._id === "Unmatched") stats.unmatched = item.count;
      if (item._id === "Duplicate") stats.duplicate = item.count;
    }

    // ✅ Accuracy formula
    if (total > 0) {
      stats.accuracy = Number(
        (((stats.matched + stats.partiallyMatched) / total) * 100).toFixed(2)
      );
    }

    return res.json(stats);
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ message: err.message });
  }
};

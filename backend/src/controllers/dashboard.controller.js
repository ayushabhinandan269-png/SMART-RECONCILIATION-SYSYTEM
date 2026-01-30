import Record from "../models/Record.js";
import ReconciliationResult from "../models/ReconciliationResult.js";

export const getDashboardStats = async (uploadJobId) => {
  const totalRecords = await Record.countDocuments({ uploadJobId });

  const aggregation = await ReconciliationResult.aggregate([
    { $match: { uploadJobId } },
    {
      $group: {
        _id: "$matchStatus",
        count: { $sum: 1 }
      }
    }
  ]);

  const stats = {
    total: totalRecords,
    matched: 0,
    partiallyMatched: 0,
    unmatched: 0,
    duplicate: 0,
    accuracy: 0
  };

  aggregation.forEach((item) => {
    if (item._id === "Matched") stats.matched = item.count;
    if (item._id === "Partially Matched")
      stats.partiallyMatched = item.count;
    if (item._id === "Unmatched") stats.unmatched = item.count;
    if (item._id === "Duplicate") stats.duplicate = item.count;
  });

  if (totalRecords > 0) {
    stats.accuracy =
      ((stats.matched + stats.partiallyMatched) / totalRecords) * 100;
  }

  return stats;
};

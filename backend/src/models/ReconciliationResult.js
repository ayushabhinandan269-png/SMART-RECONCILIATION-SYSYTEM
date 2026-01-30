import mongoose from "mongoose";

const reconciliationResultSchema = new mongoose.Schema(
  {
    recordId: mongoose.Schema.Types.ObjectId,
    uploadJobId: mongoose.Schema.Types.ObjectId,
    matchStatus: {
      type: String,
      enum: ["Matched", "Partially Matched", "Duplicate", "Unmatched"]
    },
    matchedRecordId: mongoose.Schema.Types.ObjectId,
    mismatchFields: [String]
  },
  { timestamps: true }
);

export default mongoose.model(
  "ReconciliationResult",
  reconciliationResultSchema
);

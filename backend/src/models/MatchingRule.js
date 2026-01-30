import mongoose from "mongoose";

const matchingRuleSchema = new mongoose.Schema(
  {
    exactMatchFields: {
      type: [String],
      default: ["transactionId", "amount"]
    },
    partialMatch: {
      referenceField: {
        type: String,
        default: "referenceNumber"
      },
      amountVariancePercent: {
        type: Number,
        default: 2
      }
    },
    enabled: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("MatchingRule", matchingRuleSchema);

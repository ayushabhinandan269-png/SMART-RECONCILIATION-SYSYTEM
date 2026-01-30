import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  uploadJobId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  transactionId: { type: String, index: true },
  referenceNumber: { type: String, index: true },
  amount: Number,
  date: Date,
  rawData: Object
});

export default mongoose.model("Record", recordSchema);

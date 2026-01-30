import mongoose from "mongoose";

const uploadJobSchema = new mongoose.Schema(
  {
    fileName: String,
    fileHash: { type: String, index: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    status: {
      type: String,
      enum: ["Processing", "Completed", "Failed"],
      default: "Processing"
    },
    totalRecords: Number,
    error: String
  },
  { timestamps: true }
);

export default mongoose.model("UploadJob", uploadJobSchema);

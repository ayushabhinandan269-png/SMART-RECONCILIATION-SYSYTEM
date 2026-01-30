import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      required: true
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    oldValue: {
      type: Object,
      default: null
    },
    newValue: {
      type: Object,
      default: null
    },
    userId: {
      type: String, // can be ObjectId later when auth is final
      required: true
    },
    source: {
      type: String,
      enum: ["system", "manual"],
      default: "system"
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

// 🚫 IMPORTANT: Audit logs are IMMUTABLE
// Do NOT update or delete documents from this collection

export default mongoose.model("AuditLog", auditLogSchema);

import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  actionType: {
    type: String,
    required: true,
  },
  dataAccessed: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  changes: {
    type: mongoose.Schema.Types.Mixed,
  },
  sessionId: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const AuditLog = mongoose.model("AuditLog", AuditLogSchema);
export default AuditLog;

import mongoose from "mongoose";

const emailLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["sent", "failed"],
    default: "sent",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const EmailLog = mongoose.model("EmailLog", emailLogSchema);

export default EmailLog;

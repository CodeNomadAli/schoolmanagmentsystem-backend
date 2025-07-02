import mongoose from "mongoose";

const FlagSchema = new mongoose.Schema(
  {
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'contentType',
      required: true,
    },
    contentType: {
      type: String,
      enum: ["Remedy", "Review", "AiFeedback"],
      required: true,
    },
    flaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "resolved", "dismissed"],
      default: "active",
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedAt: {
      type: Date,
    },
    resolutionNote: {
      type: String,
    }
  },
  { timestamps: true }
);

const Flag = mongoose.model("Flag", FlagSchema);
export default Flag; 
import mongoose from "mongoose";

const ReferredUserSchema = new mongoose.Schema({
  affiliateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  referredAt: {
    type: Date,
    default: Date.now,
  },
  conversionStatus: {
    type: String,
    enum: ["pending", "converted", "not converted"],
    default: "pending",
  },
  commissionRate: {
    type: Number,
    required: true,
    min: 0, 
  },
  convertedAt: {
    type: Date,
  },
}, { timestamps: true });

const ReferredUser = mongoose.model("ReferredUser", ReferredUserSchema);
export default ReferredUser;
import mongoose from "mongoose";

const AffiliateProgramSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  totalEarning: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalReferrals: {
    type: Number,
    default: 0,
    min: 0,
  },
  conversionRate: {
    type: Number,
    default: 0,
    min: 0,
  },
  earnings: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "suspended"],//update this in future
    default: "active",
  },
  paymentInfo: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"PaymentMethod"
  },
  payoutMethod: {
    type: String,
    enum: ["bank transfer", "PayPal", "check"],//update this in future
    required: true,
  },
  minimumPayout: {
    type: Number,
    default: 50,
    min: 0,
  },
  lastPayout: {
    type: Date,
  },
}, { timestamps: true });

const AffiliateProgram = mongoose.model("AffiliateProgram", AffiliateProgramSchema);
export default AffiliateProgram;
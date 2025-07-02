import mongoose from "mongoose";

const UserSubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      enum: ['free', 'premium-year',"premium-monthly","pay-per-remedy"],// maybe update this in future
      required: true,
    },
    startDate: { 
      type: Date, 
      default: Date.now,
    },
    endDate: { 
      type: Date,
      required: true,
    },
    autoRenew: { 
      type: Boolean, 
      default: false 
    },
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'completed', 'failed'],// maybe update this in future
      default: 'pending',
    },
    features: {
      type: [String],
      default: [],
    },
    monthlyPrice: { 
      type: Number, 
      required: true,
    },
    billingCycle: { 
      type: String, 
      enum: ['monthly', 'yearly'],// maybe update this in future
      required: true,
    },
    nextBillingDate: { 
      type: Date,
      required: true,
    },
    canceledAt: { 
      type: Date 
    },
  },
  { timestamps: true }
);

const UserSubscription = mongoose.model("UserSubscription", UserSubscriptionSchema);

export default UserSubscription;

import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    remedyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Remedy",
      required: true,
    },
    effectivenessRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    easeOfUseRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    sideEffectsRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    overallRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    comment: {
      type: String,
      maxlength: 1000,
    },
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"], // maybe update this in future
      default: "pending",
    },
    helpfulVotes: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

ReviewSchema.index({ userId: 1, remedyId: 1 });

const Review = mongoose.model("Review", ReviewSchema);
export default Review;

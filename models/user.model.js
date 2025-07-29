import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    accessLevel: {
      type: String,
      enum: ["user", "admin", "prouser"],
      default: "user",
    },
    subscriptionStatus: {
      type: String,
      default: "inActive",
    },
    stripeSubscriptionId: {
      type: String,
      default: null,
    },
    subscriptionType: {
      type: String,
      default: "payment",
    },
    stripeToken: {
      type: String,
      default: null,
    },
    geographicRegion: {
      type: String,
      default: "global",
    },
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: true,
    },
    twoFactorStatus: {
      type: String,
      enum: ["disabled", "pending", "enabled"],
      default: "disabled",
    },

    profileImage: {
      type: String,
      trim: true,
      default: "/user/default.png",
    },

    stripeCustomerId: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "suspended", "warning"],
      default: "active",
    },

    suspendedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    suspendedMessage: {
      type: String,
    },
    suspendedAt: {
      type: Date,
    },
    warningBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    warningMessage: {
      type: String,
    },
    warningAt: {
      type: Date,
    },

    emailVerificationToken: String,
    emailVerificationExpires: Date,
    emailVerificationRequestCount: {
      type: Number,
      default: 0,
    },
    emailVerificationTimestamp: {
      type: Date,
      default: null,
    },

    // for forget password generate token for
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    resetRequestCount: {
      type: Number,
      default: 0,
    },
    resetRequestTimestamp: {
      type: Date,
      default: null,
    },

    answeredQuestions: {
      type: [
        {
          question: { type: String, required: false },
          answer: { type: String, required: false },
        },
      ],
      default: [],
    },

    cards: [
      {
        subscriptionType: String,
        cardName: String,
        token: String,
        lastDigits: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    invoices: [
  {
    planId: String,
    planName: String,
    subscriptionType: String,
    price: Number,
    discount: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    createdAt: { type: Date, default: Date.now },
  },
],

  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// index for frequent lookups
userSchema.index({ email: 1 });
const User = mongoose.model("User", userSchema);
export default User;

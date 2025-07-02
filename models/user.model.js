// server/models/userModel.js
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
      enum: ["user", "admin","moderator","writer"], // maybe update this in future
      default: "user",
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
      default: false,
    },
    twoFactorStatus: {
      type: String,
      enum: ["disabled", "pending", "enabled"], // maybe update this in future
      default: "disabled",
    },

    // user profile image
    profileImage: {
      type: String,
      default: "/user/default.png",
    },

    // for email verification

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

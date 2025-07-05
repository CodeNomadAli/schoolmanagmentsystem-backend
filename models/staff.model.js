import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Ensure StaffRole model is registered before this file is processed
import "./staff_role.model.js"; // Import to register staff_roles model

const staffSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
    },
    staffRoleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staff_roles", // Matches model name in userModel.js
      required: true,
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
    profileImage: {
      type: String,
      default: "/user/default.png",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "warning"],
      default: "active",
    },
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

staffSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Index for frequent lookups
staffSchema.index({ email: 1 });

const Staff = mongoose.model("staff", staffSchema);
export default Staff;
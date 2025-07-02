import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    deviceType: {
      type: String,
    },
    location: {
      country: String,
      city: String,
      region: String,
    },
    loginTime: {
      type: Date,
      default: Date.now,
    },
    logoutTime: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sessionToken: {
      type: String,
      required: true,
      unique: true,
    },
    metadata: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;

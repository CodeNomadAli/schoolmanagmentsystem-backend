import mongoose from "mongoose";

const NotificationPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  newRemedyAlerts: {
    type: Boolean,
    default: false,
  },
  allRecommendations: {
    type: Boolean,
    default: false,
  },
  ratingUpdates: {
    type: Boolean,
    default: false,
  },
  subscriptionAlerts: {
    type: Boolean,
    default: false,
  },
  customAlerts: {
    type: [String],
    default: [],
  },
  emailFrequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"],// maybe update this in future
    default: "weekly",
  },
  pushEnabled: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const NotificationPreferences = mongoose.model("NotificationPreferences", NotificationPreferencesSchema);
export default NotificationPreferences;

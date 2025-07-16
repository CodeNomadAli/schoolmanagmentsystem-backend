import mongoose from "mongoose";

const freeUserSchema = new mongoose.Schema(
  {
    
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    geographicRegion: {
      type: String,
      default: "global",
    },

    
    answeredQuestions: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
      default: null,
    },

    
    remedyViewCount: {
      type: Number,
      default: 0,
      max: 3,
    },

    
    bookmarkedRemedies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Remedy",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const FreeUser = mongoose.model("FreeUser", freeUserSchema);
export default FreeUser;

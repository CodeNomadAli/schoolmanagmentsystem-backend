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
      type: [
        {
          question: { type: String, required: false },
          answer: { type: String, required: false },
          is_required: { type: Boolean },
        },
      ],
      default: [],
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

    bookMarkedCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RemedyCategory",
      },
    ],

    Comments: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },

    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const FreeUser = mongoose.model("FreeUser", freeUserSchema);
export default FreeUser;

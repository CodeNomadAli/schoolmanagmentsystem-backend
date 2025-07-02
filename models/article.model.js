import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
    },
    media: {
      type: {
        type: String,
        enum: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
      },
      source: {
        type: String,
      },
    },
    category: {
      type: String,
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "review", "published", "archived"],
      default: "draft",
    },

    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    seo: {
      metaTitle: { type: String, maxlength: 60 },
      metaDescription: { type: String, maxlength: 160 },
      keywords: [{ type: String }],
    },
    publishedAt: {
      type: Date,
    },

    lastEditedAt: {
      type: Date,
    },

    version: {
      type: Number,
      default: 1,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    viewsCount: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model("Article", articleSchema);
export default Article;

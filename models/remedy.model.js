import mongoose from "mongoose";
import slugify from "../utils/slugify.js";

const RemedySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // ✅ Enforce uniqueness in DB
    },
    slug: {
      type: String,
      require: true,
      unique: true, // ✅ Enforce uniqueness in DB
    },
    description: {
      type: String,
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RemedyCategory",
      required: true,
    },

    ingredients: [{
      type: String,
      default:[]
    }],
    preparationMethod: {
      type: String,
      default:null
    },
    brandName: {
      type: String,
      default:null
    },
    content: {
      type: String,
      default:null
    },
    media: {
      type: {
        type: String,
        enum: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
      },
      source: {
        type: String,
        required: true,
      },
      originalName: {
        type: String,
        required: false,
      },
    },
    sideEffects: [
      {
        type: String,
        default:null
      },
    ],
    preparationTime: {
      type: String,
      default:null
    },
    aiConfidenceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isAIGenerated: {
      type: Boolean,
      default: false,
    },

    usageInstructions: {
      type: String,
      required: true,
      default:null
    },
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    scientificReferences: {
      type: [String],
      default: [],
    },

    geographicRestrictions: {
      type: [String],
      default: [],
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staff",
      required: true,
    },

    viewCount: {
      type: Number,
      default: 0,
    },

    equipments: {
      type: String,
    },

    howToTakeIt: {
      type: String,
    },

    dosageAndUsage: {
      type: String,
    },

    storageInstructions: {
      type: String,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    isActive: {
      type: Boolean,
      default: false,
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

    ailments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ailment",
      },
    ],

    whyItWorks: {
      type: String,
      default: "",
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },

        message: {
          type: String,
          trim: true,
        },
        approved: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

 comments: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null, // null means top-level comment
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
],

  },

  { timestamps: true }
);

RemedySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(`${this.name}`, {
      lower: true,
      strict: true,
    });
  }
  next();
});

const Remedy = mongoose.model("Remedy", RemedySchema);

export default Remedy;

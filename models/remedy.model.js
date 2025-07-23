import mongoose from "mongoose";

const RemedySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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

    ingredients: {
      type: String,
    },
    preparationMethod: {
      type: String,
    },
    brandName: {
      type: String,
    },
    content: {
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
      originalName: {
        type: String,
        required: false,
      },
    },
    sideEffects: [{
      type: String,
    }],
    preparationTime: {
      type: String,
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
  },

  { timestamps: true }
);

const Remedy = mongoose.model("Remedy", RemedySchema);
export default Remedy;

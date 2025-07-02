import mongoose from "mongoose";

// Define category enum as a constant for maintainability and clarity
export const REMEDY_CATEGORIES = [
  "Community Remedies",
  "Pain Relief",
  "Digestive",
  "Respiratory",
  "Immune Support",
  "Sleep Aid",
  "Skin Care",
];
const REMEDY_TYPES = ["pharmaceutical", "alternative", "community"];
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
      type: String,
      enum: REMEDY_CATEGORIES, // reference the constant here
      required: true,
    },
    ingredients: {
      type: String,
    },
    preparationMethod: {
      type: String,
    },
    brandName:{
      type:String,
    },
    instructions: {
      type: String,
      default: "",
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
    },
    sideEffects: {
      type: String,
    },
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
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"], // maybe update this in future
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
    type: {
      type: String,
      enum: REMEDY_TYPES,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
      default: true,
    },
  },
  { timestamps: true }
);

const Remedy = mongoose.model("Remedy", RemedySchema);
export default Remedy;

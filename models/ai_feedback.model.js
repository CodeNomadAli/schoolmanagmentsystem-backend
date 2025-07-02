import mongoose from "mongoose";

const AiFeedbackSchema = new mongoose.Schema({
  remedyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Remedy",
    required: true, 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, 
  },
  usefulness: {
    type: Number,
    min: 1, // Minimum value for usefulness
    max: 5, // Maximum value for usefulness
    required: true,
  },
  feedbackText: {
    type: String,
    maxlength: 500, // Limit the length of feedback text
  },
  improvedCondition: {
    type: Boolean,
    default: false, 
  },
  sideEffectReported: {
    type: Boolean,
    default: false,
  },
  aiModelDetails: {// update this object in future
    modelNames: { type: String },
    version: { type: String }, // Version of the AI model used
    trainingDataSource: { type: String }
  },
  feedbackDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Create a text index for searching feedback text
AiFeedbackSchema.index({ feedbackText: 'text' });

const AiFeedback = mongoose.model("AiFeedback", AiFeedbackSchema);
export default AiFeedback;
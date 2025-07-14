import mongoose from "mongoose";

const RemedyCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    relatedQuestions: {
      type: [
        {
          question: { type: String, required: true },
          answer: { type: String }, 
        },
      ],
    
    },
  },
  { timestamps: true }
);

const RemedyCategory = mongoose.model("RemedyCategory", RemedyCategorySchema);
export default RemedyCategory;

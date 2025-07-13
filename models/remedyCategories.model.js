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
  },
  { timestamps: true }
);

const RemedyCategory = mongoose.model("RemedyCategory", RemedyCategorySchema);

export default RemedyCategory;

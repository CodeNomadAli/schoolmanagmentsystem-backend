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

    isPublick: {
      type: Boolean,
      default: false,
    },

    

    relatedQuestions: {
      type: [
        {
          question: { type: String, required: true },
          is_required: { type: Boolean, default: false },
          multiple: { type: Boolean, default: false },
          input_type: {
            type: String,
            enum: ["text", "textarea", "select", "radio", "checkbox"],
            required: true,
          },
          options: {
            type: [
              {
                value: { type: String, required: true },
                label: { type: String, required: true },
                
              },
            ],
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const RemedyCategory = mongoose.model("RemedyCategory", RemedyCategorySchema);

export default RemedyCategory;

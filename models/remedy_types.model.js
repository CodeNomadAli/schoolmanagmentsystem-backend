import mongoose from "mongoose";

const RemedyTypeSchema = new mongoose.Schema(
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

    elements: {
      type: [
        {
          field: { type: String, required: true },
          fieldType: {
            type: String,
            enum: ["input", "textarea", "radio", "checkbox", "list", "dropdown", "image", "video"],
            required: true,
          },
          label: { type: String },
          options: { type: [String], default: [] },
          required: { type: Boolean, default: false },
        },
      ],
      default: [],
    },

  },
  { timestamps: true }
);

const RemedyType = mongoose.model("RemedyType", RemedyTypeSchema);

export default RemedyType;

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
          is_required: { type: Boolean, default: false },
          input_type: {
            type: String,
            enum: ['text', 'textarea', 'select', 'radio', 'checkbox'],
            required: true,
          },
          options: {
            type: [
              {
                value: { type: String, required: true },
                label: { type: String, required: true },
              },
            ],
            validate: {
              validator: function (val) {
                const needsOptions = ['select', 'radio', 'checkbox'];
                if (needsOptions.includes(this.input_type)) {
                  return Array.isArray(val) && val.length > 0;
                } else {
                  return !val || val.length === 0;
                }
              },
              message:
                "Options are only allowed for 'select', 'radio', or 'checkbox' types and must be non-empty.",
            },
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

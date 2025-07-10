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
              field: {
                type: String,
                required: true,
              },
              type: {
                type: String, 
                enum: ["input", "textarea", "radio", "checkbox", "list", "dropdown", "image", "video"],
                required: true,
              },
              label: {
                type: String, 
              },
              options: {
                type: [String], // for radio/checkbox/dropdown
                default: [],
              },
              required: {
                type: Boolean,
                default: false,
              },
    
            }
          ],
          default: [],
        },
  },
  { timestamps: true }
);

const RemedyType = mongoose.model("RemedyType", RemedyTypeSchema);

export default RemedyType;


// {
//   "elements": [
//     {
//       "field": "description",
//       "type": "textarea",
//       "label": "Remedy Description",
//       "required": true
//     },
//     {
//       "field": "category",
//       "type": "dropdown",
//       "label": "Select Remedy Category",
//       "options": ["Pain Relief", "Digestive", "Sleep Aid"],
//       "required": true
//     },
//     {
//       "field": "instructions",
//       "type": "list",
//       "label": "Usage Instructions"
//     },
//     {
//       "field": "sideEffects",
//       "type": "textarea",
//       "label": "Possible Side Effects"
//     }
//   ]
// }

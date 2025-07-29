import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      
    },
    slug :{
      type :String,
      enum: ["free","monthly", "five-remedies", "ten-remedies", "annually"],
      unique: true,
      default:""
    },
    planId: {
      type: String, // Stripe Price ID
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    interval: {
      type: String,
      required: true,
      enum: ["month", "year", "one_time", "annually"],
      default: "one_time",
    },
    description: {
      type: String,
      default: "",
    },

    features: {
      type: [
        {
          slug: {
            type: String,
            required: false,
            lowercase: true,
            trim: true,
          },
          description: {
            type: [String],
            lowercase: true,
            trim: true,
            required: false,
            default: [],
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Plan", planSchema);

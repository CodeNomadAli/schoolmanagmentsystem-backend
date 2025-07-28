import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: [
      "monthly",
      "five-remedies",
      "ten-remedies",
      "annually"
    ],
    unique: true,
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
    enum: ["month", "year", "one_time","annually"],
    default: "one_time",
  },
  description: {
    type: String,
    default: "",
  },
  features: {
    type: [String],   
    default: [],
  },
}, {
  timestamps: true,
});

const Plan = mongoose.model("Plan", planSchema);
export default Plan;

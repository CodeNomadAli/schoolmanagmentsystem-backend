  import mongoose from "mongoose";

  const planSchema = new mongoose.Schema(
    {

      name: {
        type: String
      },
      slug :{
        type :String,
        unique: true,
        default:""
      },
      planId: {
        type: String, 
        required: true,
        unique: true,
      },
      subscriptionType: {
        type: String,
        default: "payment",
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
        slug: { type: String, required: true },
        description: { type: String, required: true },
        remedies: { type: [String], default: [] },
      }
    ],
    default: [],
  }

    },
    {
      timestamps: true,
    }
  );

  export default mongoose.model("Plan", planSchema);

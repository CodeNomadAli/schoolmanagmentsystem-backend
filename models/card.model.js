
import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    cardName: {
      type: String,
      required: false,
    },
    token: {
      type: String,
      required: true,
    },
    lastDigits:{
      type: String,
      default:null
    }
  },
  { timestamps: true }
);

const Card = mongoose.model("Card", cardSchema);
export default Card;

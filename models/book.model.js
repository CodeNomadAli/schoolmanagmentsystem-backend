import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    author: { type: String, required: true, trim: true },

    isbn: {
      type: String,
      required: true,
      trim: true,
    },

    genre: { type: String, trim: true },

    quantity: { type: Number, required: true, default: 1 },

    available: { type: Number, required: true, default: 1 },

    school_id: { type: String, required: true },
  },
  { timestamps: true }
);



const Book = mongoose.model("Book", bookSchema);
export default Book;
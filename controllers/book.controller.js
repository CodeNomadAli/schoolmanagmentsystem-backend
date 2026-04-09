import Book from "../models/book.model.js";
import { apiResponse } from "../helper.js";

// ---------------- CREATE ----------------
export const addBook = async (req, res) => {
  try {
    const { title, author, isbn, genre, quantity, available } = req.body;
    const school_id = req.user.school_id;

    // check duplicate ISBN in same school
    const existingBook = await Book.findOne({ isbn, school_id });
    if (existingBook) {
      return res
        .status(409)
        .json(apiResponse(409, null, "Book with this ISBN already exists in this school"));
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      genre,
      quantity,
      available: available || quantity,
      school_id,
    });

    return res
      .status(201)
      .json(apiResponse(201, book, "Book added successfully"));
  } catch (err) {
    console.error("Add book error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- GET ALL ----------------
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find({
      school_id: req.user.school_id,
    });

    return res
      .status(200)
      .json(apiResponse(200, books, "Books fetched successfully"));
  } catch (err) {
    console.error("Get books error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- GET ONE ----------------
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Book not found"));
    }

    return res
      .status(200)
      .json(apiResponse(200, book, "Book fetched successfully"));
  } catch (err) {
    console.error("Get book error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- UPDATE ----------------
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Book not found"));
    }

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined && req.body[key] !== "") {
        book[key] = req.body[key];
      }
    });

    await book.save();

    return res
      .status(200)
      .json(apiResponse(200, book, "Book updated successfully"));
  } catch (err) {
    console.error("Update book error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- DELETE ----------------
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Book not found"));
    }

    await book.remove();

    return res
      .status(200)
      .json(apiResponse(200, null, "Book deleted successfully"));
  } catch (err) {
    console.error("Delete book error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};
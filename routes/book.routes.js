import express from "express";
import {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/book.controller.js";

import optionalAuth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", optionalAuth, addBook);

router.get("/", optionalAuth, getBooks);
router.get("/:id", optionalAuth, getBookById);

router.put("/:id", optionalAuth, updateBook);
router.delete("/:id", optionalAuth, deleteBook);

export default router;
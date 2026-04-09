import express from "express";
import {
  addStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller.js";

import optionalAuth from "../middleware/auth.middleware.js";

const router = express.Router();

// ---------------- CREATE ----------------
router.post("/", optionalAuth, addStudent);

// ---------------- READ ----------------
router.get("/", optionalAuth, getStudents);
router.get("/:id", optionalAuth, getStudentById);

// ---------------- UPDATE ----------------
router.put("/:id", optionalAuth, updateStudent);

// ---------------- DELETE ----------------
router.delete("/:id", optionalAuth, deleteStudent);

export default router;
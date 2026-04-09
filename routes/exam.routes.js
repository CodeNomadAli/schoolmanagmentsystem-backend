import express from "express";
import {
  addExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
} from "../controllers/exam.controller.js";
import optionalAuth from "../middleware/auth.middleware.js";

const router = express.Router();

// Add Exam
router.post("/", optionalAuth, addExam);

// Get All Exams
router.get("/", optionalAuth, getExams);

// Get Exam by ID
router.get("/:id", optionalAuth, getExamById);

// Update Exam
router.put("/:id", optionalAuth, updateExam);

// Delete Exam
router.delete("/:id", optionalAuth, deleteExam);

export default router;
import express from "express";
import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  addTeacherToSubject,
  removeTeacherFromSubject,
} from "../controllers/subject.controller.js";

import  verifyToken  from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ Protect all routes
router.use(verifyToken);


// 📌 SUBJECT CRUD

// Create
router.post("/", createSubject);

// Get all
router.get("/", getSubjects);

// Get one
router.get("/:id", getSubjectById);

// Update
router.put("/:id", updateSubject);

// Delete
router.delete("/:id", deleteSubject);


// 📌 TEACHER MANAGEMENT

// Add teacher to subject
router.post("/add-teacher", addTeacherToSubject);

// Remove teacher from subject
router.post("/remove-teacher", removeTeacherFromSubject);


export default router;
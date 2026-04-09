import express from "express";
import {
  addTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacher.controller.js";
import auth from "../middleware/auth.middleware.js";
const router = express.Router();

// Create
router.post("/",auth, addTeacher);

// Read
router.get("/",auth, getTeachers);
router.get("/:id",auth, getTeacherById);

// Update
router.put("/:id",auth, updateTeacher);

// Delete
router.delete("/:id",auth, deleteTeacher);

export default router;
import express from "express";
import {
  addGrade,
  getGrades,
  getGradeById,
  updateGrade,
  deleteGrade,
} from "../controllers/grade.controller.js";

import optionalAuth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", optionalAuth, addGrade);

router.get("/", optionalAuth, getGrades);
router.get("/:id", optionalAuth, getGradeById);

router.put("/:id", optionalAuth, updateGrade);
router.delete("/:id", optionalAuth, deleteGrade);

export default router;
import express from "express";
import {
  addAttendance,
  getAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
} from "../controllers/attendance.controller.js";

import optionalAuth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", optionalAuth, addAttendance);

router.get("/", optionalAuth, getAttendance);
router.get("/:id", optionalAuth, getAttendanceById);

router.put("/:id", optionalAuth, updateAttendance);
router.delete("/:id", optionalAuth, deleteAttendance);

export default router;
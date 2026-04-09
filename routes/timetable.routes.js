import express from "express";
import { getAllTimetables, addTimeSlot, deleteTimeSlot } from "../controllers/timetable.controller.js";
import  authMiddleware  from "../middleware/auth.middleware.js";
// import aut
const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all timetables
router.get("/", getAllTimetables);

// Add time slot(s)
router.post("/", addTimeSlot);

// Delete a time slot
router.delete("/:timetableId/slot/:slotId", deleteTimeSlot);

export default router;
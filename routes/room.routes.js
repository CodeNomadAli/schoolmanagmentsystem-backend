import express from "express";
import {
  addRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} from "../controllers/room.controller.js";

import optionalAuth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", optionalAuth, addRoom);

router.get("/", optionalAuth, getRooms);
router.get("/:id", optionalAuth, getRoomById);

router.put("/:id", optionalAuth, updateRoom);
router.delete("/:id", optionalAuth, deleteRoom);

export default router;
import express from "express";
import {
  addClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
} from "../controllers/class.controller.js";

import optionalAuth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", optionalAuth, addClass);

router.get("/", optionalAuth, getClasses);
router.get("/:id", optionalAuth, getClassById);

router.put("/:id", optionalAuth, updateClass);
router.delete("/:id", optionalAuth, deleteClass);

export default router;
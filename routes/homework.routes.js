import express from "express";
import {
  createHomework,
  getAllHomework,
  getHomeworkById,
  updateHomework,
  deleteHomework,
} from "../controllers/homework.controller.js";

const router = express.Router();

import optionalAuth from "../middleware/auth.middleware.js";

router.post("/",optionalAuth, createHomework);
router.get("/",optionalAuth, getAllHomework);
router.get("/:id",optionalAuth, getHomeworkById);
router.put("/:id",optionalAuth, updateHomework);
router.delete("/:id",optionalAuth, deleteHomework);

export default router;
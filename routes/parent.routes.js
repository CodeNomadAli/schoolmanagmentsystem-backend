import express from "express";
import {
  addParent,
  getParents,
  getParentById,
  updateParent,
  deleteParent,
} from "../controllers/parent.controller.js";

import optionalAuth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", optionalAuth, addParent);

router.get("/", optionalAuth, getParents);
router.get("/:id", optionalAuth, getParentById);

router.put("/:id", optionalAuth, updateParent);
router.delete("/:id", optionalAuth, deleteParent);

export default router;
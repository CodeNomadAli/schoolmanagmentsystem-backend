import express from "express";
import {
  addFee,
  getFees,
  getFeeById,
  updateFee,
  deleteFee,
} from "../controllers/fee.controller.js";

import optionalAuth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", optionalAuth, addFee);

router.get("/", optionalAuth, getFees);
router.get("/:id", optionalAuth, getFeeById);

router.put("/:id", optionalAuth, updateFee);
router.delete("/:id", optionalAuth, deleteFee);

export default router;
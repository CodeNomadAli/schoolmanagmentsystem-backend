import express from "express";
import {
  createPlan,
  getAllPlans,
  getPlanById,
  deletePlan,
} from "../controllers/plan.controller.js";

const router = express.Router();

router.post("/create", createPlan);
router.get("/", getAllPlans);
router.get("/:id", getPlanById);
router.delete("/:id", deletePlan);

export default router;

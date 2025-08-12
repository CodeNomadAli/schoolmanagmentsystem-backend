import express from "express";
import {
  addOrUpdateReview,
  getRemedyReviews,
} from "../controllers/review.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// PUT - Add or update review
router.put("/:id",auth, addOrUpdateReview);

// GET - Get all reviews
router.get("/:remedyId/reviews", getRemedyReviews);

export default router;
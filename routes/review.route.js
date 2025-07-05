import express from "express";
import { createReview, getReviewRatingsByRemedyId } from "../controllers/review.controller.js";
import auth from "../middleware/auth.middleware.js";


const reviewRouter = express.Router();

// POST / - Create a new review (requires authentication)
reviewRouter.post('/', auth, createReview);

// GET /remedy/:id - Get review ratings by remedy ID
reviewRouter.get("/remedy/:id", getReviewRatingsByRemedyId);

// GET /remedy/flg - (Commented out) Get review ratings by remedy flag
// reviewRouter.get("/remedy/flg", getReviewRatingsByRemedyId)



export default reviewRouter;
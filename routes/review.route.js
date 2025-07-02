import express from "express";
import { createReview, getReviewRatingsByRemedyId } from "../controllers/review.controller.js";
import auth from "../middleware/auth.middleware.js";


const reviewRouter = express.Router();

reviewRouter.post('/',auth,createReview);
reviewRouter.get("/remedy/:id",getReviewRatingsByRemedyId)
// reviewRouter.get("/remedy/flg",getReviewRatingsByRemedyId)




export default reviewRouter;
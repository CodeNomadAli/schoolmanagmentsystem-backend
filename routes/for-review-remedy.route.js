import { getAllRemedies,getAllCategoryAilments } from "../controllers/for-review-remedy.controller.js";
import express from  "express"

const reviewRemedy= express.Router()

reviewRemedy.get("/ailments-categories", getAllCategoryAilments); // ✅ combined
reviewRemedy.get("/",getAllRemedies)

export default reviewRemedy
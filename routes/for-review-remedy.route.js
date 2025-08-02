import { getAllRemedies } from "../controllers/for-review-remedy.controller.js";
import express from  "express"

const reviewRemedy= express.Router()


reviewRemedy.get("/",getAllRemedies)

export default reviewRemedy
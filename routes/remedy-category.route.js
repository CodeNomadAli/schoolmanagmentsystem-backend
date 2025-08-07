import { getAllCategory } from "../controllers/remedy-category.controller.js";
import express from "express"

const categoryRouter = express.Router()


categoryRouter.get("/",getAllCategory)


export default categoryRouter
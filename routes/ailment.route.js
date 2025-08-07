import { getAllAilments } from "../controllers/ailment.controller.js";
import express from "express"

const ailmentRouter = express.Router()


ailmentRouter.get("/",getAllAilments)

export default ailmentRouter
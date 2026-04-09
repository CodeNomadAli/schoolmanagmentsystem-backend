import express from "express";
import { askAI,chatWithGroq } from "../controllers/askai.controller.js";

const router = express.Router();

router.post("/askai", askAI);
router.post("/askaiGrok", chatWithGroq);


export default router;

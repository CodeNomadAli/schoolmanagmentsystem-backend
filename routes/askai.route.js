import express from "express";
import { askAI } from "../controllers/askai.controller.js";

const router = express.Router();

router.post("/askai", askAI);

export default router;

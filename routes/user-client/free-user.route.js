import express from "express";
import { getFreeUserDashboard } from "../../controllers/user_client/freeUser.contoller.js";

const router = express.Router();

router.get("/freeuser/dashboard/:userId", getFreeUserDashboard);

export default router;

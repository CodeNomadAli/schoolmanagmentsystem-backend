import express from "express";
import {
  healthProfileStatus,
  getUserHealthQuestionBaseOnHealthProfile,
  userHealthProfile,
} from "../controllers/userProfile.controller.js";

const userRouter = express.Router();

// POST /health-profile/generate
userRouter.post(
  "/health-profile/generate",
  getUserHealthQuestionBaseOnHealthProfile
);

// POST /health-profile
userRouter.post("/health-profile", userHealthProfile);

// GET /health-profile/status
userRouter.get("/health-profile/status", healthProfileStatus);

export default userRouter;

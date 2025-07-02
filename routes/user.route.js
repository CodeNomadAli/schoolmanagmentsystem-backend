import express from "express";
import {
  healthProfileStatus,
  getUserHealthQuestionBaseOnHealthProfile,
  userHealthProfile,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post(
  "/health-profile/generate",
  getUserHealthQuestionBaseOnHealthProfile
);

userRouter.post("/health-profile", userHealthProfile);
userRouter.get("/health-profile/status", healthProfileStatus);

export default userRouter;

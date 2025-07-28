import express from "express";
import User from "../models/user.model.js";

const router = express.Router();


router.put("/questions/:userId", async (req, res) => {
  const { userId } = req.params;
  const { answeredQuestions } = req.body;

  if (!Array.isArray(answeredQuestions)) {
    return res.status(400).json({ error: "answeredQuestions must be an array." });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { answeredQuestions },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      message: "Questions updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Error updating questions:", error);
    res.status(500).json({ error: "Server error while updating questions." });
  }
});

export default router;

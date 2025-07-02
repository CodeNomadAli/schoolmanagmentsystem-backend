import UserProfile from "../models/user_profile.model.js";
import generateHealthQuestions from "../services/healthQuestion.service.js";
import { userHealthProfileValidation } from "../validations/user.validations.js";

const userHealthProfile = async (req, res) => {
  try {
    const { error } = userHealthProfileValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const userId = req.user.id;
    const profileData = req.body;

    const existingProfile = await UserProfile.findOne({ userId });

    const updatedProfile = existingProfile
      ? await UserProfile.findOneAndUpdate(
          { userId },
          { $set: { ...profileData, lastUpdated: new Date() } },
          { new: true, runValidators: true }
        )
      : await UserProfile.create({ userId, ...profileData });

    return res.status(200).json({
      success: true,
      message: existingProfile
        ? "Profile updated successfully"
        : "Profile created successfully",
      data: updatedProfile,
    });
  } catch (err) {
    console.error("User Profile Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getUserHealthQuestionBaseOnHealthProfile = async (req, res) => {
  try {
    const { error } = userHealthProfileValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error,
      });
    }

    const healthQuestions = await generateHealthQuestions(req.body);

    return res.status(200).json({
      success: true,
      message: "Health questions generated successfully",
      data: healthQuestions,
    });
  } catch (error) {
    console.error("Health Questions Generation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const healthProfileStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const userProfileExist = await UserProfile.findOne({ userId });

    if (!userProfileExist) {
      return res.status(400).json({
        message: "profile not exist",
        success: false,
      });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "profile exist",
        profile: userProfileExist,
      });
  } catch (error) {
    console.error("Error checking health profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check health profile status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export {
  userHealthProfile,
  getUserHealthQuestionBaseOnHealthProfile,
  healthProfileStatus,
};

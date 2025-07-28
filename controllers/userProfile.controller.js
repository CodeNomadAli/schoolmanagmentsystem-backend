import UserProfile from "../models/user_profile.model.js";
import generateHealthQuestions from "../services/healthQuestion.service.js";
import { apiResponse } from "../helper.js";
// import { userHealthProfileValidation } from "../validations/user.validations.js";

const userHealthProfile = async (req, res) => {
  try {
  
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

    const message = existingProfile
      ? "Profile updated successfully"
      : "Profile created successfully";

    return res.status(200).json(apiResponse(200, updatedProfile, message));
  } catch (err) {
    console.error("User Profile Error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

const getUserHealthQuestionBaseOnHealthProfile = async (req, res) => {
  try {
    
   

    const healthQuestions = await generateHealthQuestions(req.body);

    return res
      .status(200)
      .json(apiResponse(200, healthQuestions, "Health questions generated successfully"));
  } catch (error) {
    console.error("Health Questions Generation Error:", error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

const healthProfileStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const userProfileExist = await UserProfile.findOne({ userId });

    if (!userProfileExist) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Profile not found"));
    }

    return res
      .status(200)
      .json(apiResponse(200, userProfileExist, "Profile exists"));
  } catch (error) {
    console.error("Error checking health profile:", error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Failed to check health profile status"));
  }
};

export {
  userHealthProfile,
  getUserHealthQuestionBaseOnHealthProfile,
  healthProfileStatus,
};

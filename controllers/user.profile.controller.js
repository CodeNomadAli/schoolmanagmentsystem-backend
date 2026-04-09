import UserProfile from "../models/user_profile.model.js";
import { apiResponse } from "../helper.js";
import { uploadImageFromBuffer } from "../utils/uploadImageToCloudinary.js";

export const upsertUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json(apiResponse(401, null, "Unauthorized"));
    }

    const {
      firstName,
      lastName,
      phone,
      address,
      isEmail,
      isNotification,
      isGrade,
      homeworkReminders,
      reportNotifications,
      theme,
      security,
    } = req.body;



    let profileImage;

    // ✅ Upload image if provided
    if (req.file) {
      const uploaded = await uploadImageFromBuffer(req.file.buffer);
      profileImage = {
        type: req.file.mimetype,
        source: uploaded.source,
        originalName: req.file.originalname,
      };
    }

    // ✅ Prepare update data (MATCHES YOUR SCHEMA)
    const setData = {
      firstName,
      lastName,
      phone,
      address,
      theme,
      lastUpdated: new Date(),

      // ✅ Flat boolean fields
      isEmail: isEmail ?? true,
      isNotification: isNotification ?? true,
      isGrade: isGrade ?? true,
      homeworkReminders: homeworkReminders ?? true,
      reportNotifications: reportNotifications ?? true,

      // ✅ Nested security
      "security.twoFactorAuth": security?.twoFactorAuth ?? false,
      "security.sessionTimeout": security?.sessionTimeout || "60",
    };

    // ✅ Only add image if exists
    if (profileImage) {
      setData.profileImage = profileImage;
    }

    // ❗ Remove undefined values (important)
    Object.keys(setData).forEach(
      (key) => setData[key] === undefined && delete setData[key]
    );

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      {
        $set: setData,
        $setOnInsert: { userId },
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res
      .status(200)
      .json(apiResponse(200, profile, "Profile saved successfully"));
  } catch (error) {
    console.error("Profile Update Error:", error);
    return res
      .status(500)
      .json(
        apiResponse(500, null, error.message || "Error saving profile")
      );
  }
};



// ✅ GET profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json(
        apiResponse(401, null, "Unauthorized")
      );
    }

    const profile = await UserProfile
      .findOne({ userId })
      .populate("userId", "-password");

    if (!profile) {
      return res.status(404).json(
        apiResponse(404, null, "Profile not found")
      );
    }

    return res.status(200).json(
      apiResponse(200, profile, "Profile fetched successfully")
    );

  } catch (error) {
    return res.status(500).json(
      apiResponse(500, null, error.message || "Error fetching profile")
    );
  }
};



// ✅ DELETE profile
export const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json(
        apiResponse(401, null, "Unauthorized")
      );
    }

    const deleted = await UserProfile.findOneAndDelete({ userId });

    if (!deleted) {
      return res.status(404).json(
        apiResponse(404, null, "Profile not found")
      );
    }

    return res.status(200).json(
      apiResponse(200, null, "Profile deleted successfully")
    );

  } catch (error) {
    return res.status(500).json(
      apiResponse(500, null, error.message || "Error deleting profile")
    );
  }
};
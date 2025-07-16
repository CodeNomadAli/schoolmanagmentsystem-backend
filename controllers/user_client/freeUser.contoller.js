import User from "../../models/user.model.js";
import FreeUser from "../../models/user-client/freeUser.model.js";

export const getFreeUserDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.accessLevel !== "freeuser") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied: Not a free user" });
    }

    const freeUser = await FreeUser.findOne({ auth: userId })
      .populate({ path: "bookmarkedRemedies" })
      .populate({ path: "answeredQuestions" });

    if (!freeUser) {
      return res
        .status(404)
        .json({ success: false, message: "Free user profile not found" });
    }

    return res.json({
      success: true,
      accessLevel: user.accessLevel,
      remedyViewCount: freeUser.remedyViewCount,
      maxViewsAllowed: 3,
      bookmarkedRemedies: freeUser.bookmarkedRemedies,
      answeredQuestions: freeUser.answeredQuestions,
      canViewAnalytics: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Error fetching free user data",
        error,
      });
  }
};

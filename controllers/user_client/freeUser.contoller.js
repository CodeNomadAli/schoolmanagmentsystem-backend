import User from "../../models/user.model.js";
import FreeUser from "../../models/user-client/freeUser.model.js";
import Remedy from "../../models/remedy.model.js";
import RemedyCategory from "../../models/remedy_categories.model.js";


export const getFreeUserDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.accessLevel !== "freeuser")
      return res.status(403).json({ success: false, message: "Access denied: Not a free user" });

    const freeUser = await FreeUser.findOne({ auth: userId })
     .populate("auth")                  
      .populate("bookmarkedRemedies")   
      .populate("answeredQuestions");   
  

    if (!freeUser) return res.status(404).json({ success: false, message: "Free user profile not found" });

    const freeRemedies = await Remedy.find({ isPublic: true }).limit(3);
    const remedyCategories = await RemedyCategory.find();

    return res.json({
      success: true,
      accessLevel: user.accessLevel,
      remedyViewCount: freeUser.remedyViewCount || 0,
      maxViewsAllowed: 3,
      bookmarkedRemedies: freeUser.bookmarkedRemedies,
      answeredQuestions: freeUser.answeredQuestions,
      remedies: freeRemedies,
      remedyCategories,
      canViewAnalytics: false,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching free user dashboard data", error: error.message });
  }
};



export const getAllFreeUsers = async (req, res) => {
  try {
    const freeUsers = await FreeUser.find()
      .populate("auth")                  
      
    return res.json({      
      success: true,
      count: freeUsers.length,
      freeUsers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching all free users",
      error: error.message || error,
    });
  }
};

export const bookmarkRemedy = async (req, res) => {
  const { userId, remedyId } = req.params;

  try {
    const updatedUser = await FreeUser.findByIdAndUpdate(
      userId,
      { $addToSet: { bookmarkedRemedies: remedyId } }, 
      { new: true }
    ).populate("bookmarkedRemedies");

    res.status(200).json({
      success: true,
      message: "Remedy bookmarked successfully",
      bookmarkedRemedies: updatedUser.bookmarkedRemedies,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove bookmark for Remedy
export const removeBookmarkRemedy = async (req, res) => {
  const { userId, remedyId } = req.params;

  try {
    const updatedUser = await FreeUser.findByIdAndUpdate(
      userId,
      { $pull: { bookmarkedRemedies: remedyId } }, // remove if present
      { new: true }
    ).populate("bookmarkedRemedies");

    res.status(200).json({
      success: true,
      message: "Remedy unbookmarked successfully",
      bookmarkedRemedies: updatedUser.bookmarkedRemedies,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Bookmark a Category
export const bookmarkCategory = async (req, res) => {
  const { userId, categoryId } = req.params;

  try {
    const updatedUser = await FreeUser.findByIdAndUpdate(
      userId,
      { $addToSet: { bookMarkedCategory: categoryId } }, // add if not present
      { new: true }
    ).populate("bookMarkedCategory");

    res.status(200).json({
      success: true,
      message: "Category bookmarked successfully",
      bookMarkedCategory: updatedUser.bookMarkedCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeBookmarkCategory = async (req, res) => {
  const { userId, categoryId } = req.params;

  try {
    const updatedUser = await FreeUser.findByIdAndUpdate(
      userId,
      { $pull: { bookMarkedCategory: categoryId } }, 
      { new: true }
    ).populate("bookMarkedCategory");

    res.status(200).json({
      success: true,
      message: "Category unbookmarked successfully",
      bookMarkedCategory: updatedUser.bookMarkedCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
import mongoose from "mongoose";
import Remedy from "../models/remedy.model.js";
import ModerationStatus from "../models/moderation_status.model.js";
import { adminModerateRemedyValidation } from "../validations/admin.validation.js";
import User from "../models/user.model.js";
import AuditLog from "../models/audit_log.model.js";

/**
 * Admin moderation controller for remedy.
 * Allows admin to approve or reject a flagged remedy.
 */
const adminModerateRemedy = async (req, res) => {
  try {
    const id = req.params.id;
    const adminId = req.user?.id;
    const { error } = adminModerateRemedyValidation.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message, success: false });
    }
    const { status, moderatorNote = "", rejectionReason = "" } = req.body;

    // Validate remedy ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid remedy ID format.", success: false });
    }

    // Find remedy
    const remedy = await Remedy.findById(id);
    if (!remedy) {
      return res
        .status(404)
        .json({ message: "Remedy not found.", success: false });
    }

    // Find or create moderation status
    let moderationStatus = await ModerationStatus.findOne({
      contentId: remedy._id,
      contentType: "Remedy",
    });

    if (!moderationStatus) {
      moderationStatus = new ModerationStatus({
        contentId: remedy._id,
        contentType: "Remedy",
        status,
        reviewedBy: adminId,
        reviewDate: new Date(),
        moderatorNotes: moderatorNote,
        rejectionReason: status === "rejected" ? rejectionReason : "",
        flagCount: 0,
        moderationHistory: [],
      });
    } else {
      moderationStatus.status = status;
      moderationStatus.reviewedBy = adminId;
      moderationStatus.reviewDate = new Date();
      moderationStatus.moderatorNotes = moderatorNote;
      if (status === "approved") {
        moderationStatus.flagCount = 0;
        moderationStatus.moderationHistory = [];
        moderationStatus.rejectionReason = "";
      } else if (status === "rejected") {
        moderationStatus.rejectionReason = rejectionReason;
      }
    }

    // Update remedy's moderation status and isActive
    remedy.moderationStatus = status;
    remedy.isActive = status === "approved";

    // Save both models
    await Promise.all([moderationStatus.save(), remedy.save()]);

    return res.status(200).json({
      message: `Remedy successfully ${status}.`,
      remedy,
      moderationStatus,
      success: true,
    });
  } catch (error) {
    console.error("[AdminModerateRemedy] Error:", error);
    return res.status(500).json({
      message: "An unexpected error occurred while moderating the remedy.",
      error: error.message,
      success: false,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const adminId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const role = req.query.role?.toLowerCase();
    const lastActive = req.query.lastActive;

    // Build search query
    const searchQuery = {
      _id: { $ne: adminId },
      $or: [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    // Add role filter if provided
    if (role && ["admin", "user", "moderator", "writer"].includes(role)) {
      searchQuery.accessLevel = role;
    }

    // Add last active filter if provided
    if (lastActive) {
      const timeRanges = {
        today: new Date(Date.now() - 24 * 60 * 60 * 1000),
        week: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        month: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      };

      if (timeRanges[lastActive]) {
        searchQuery.lastLogin = { $gte: timeRanges[lastActive] };
      }
    }

    // Get total count of users matching search (excluding admin)
    const totalUsers = await User.countDocuments(searchQuery);

    // Fetch paginated users except the current admin
    const users = await User.find(searchQuery, {
      password: 0,
      emailVerificationRequestCount: 0,
      emailVerificationTimestamp: 0,
      resetRequestTimestamp: 0,
      resetRequestCount: 0,
    })
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: {
        users,
        pagination: {
          total: totalUsers,
          page,
          limit,
          totalPages: Math.ceil(totalUsers / limit),
          hasNextPage: page < Math.ceil(totalUsers / limit),
          hasPrevPage: page > 1,
        },
        filters: {
          role,
          lastActive,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Prevent admin from deleting themselves
    if (id === adminId) {
      return res.status(403).json({
        success: false,
        message: "Admin cannot delete their own account",
      });
    }

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User successfully deleted",
      userId: user._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

const userAccountStatus = async (req, res) => {
  try {
    const { id, message, status } = req.body;
    const adminId = req.user.id;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Prevent admin from modifying their own account
    if (id === adminId) {
      return res.status(403).json({
        success: false,
        message: "Admin cannot modify their own account",
      });
    }
    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Handle different action types
    switch (status) {
      case "warning":
        user.status = "warning";
        user.warningMessage = message;
        user.warningBy = adminId;
        user.warningAt = new Date();
        break;

      case "suspend":
        user.status = "suspended";
        user.suspendedMessage = message;
        user.suspendedBy = adminId;
        user.suspendedAt = new Date();
        break;

      case "active":
        user.status = "active";
        user.suspendedMessage = null;
        user.suspendedBy = null;
        user.suspendedAt = null;
        break;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${status} successful`,
      data: {
        userId: user._id,
        status,
      },
    });
  } catch (error) {
    console.error("[userAccountStatus] Error:", error);
    return res.status(500).json({
      success: false,
      message: `Failed to ${status} user`,
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

const changeUserRole = async (req, res) => {
  try {
    const { id, role } = req.body;
    const adminId = req.user.id;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Prevent admin from modifying their own role
    if (id === adminId) {
      return res.status(403).json({
        success: false,
        message: "Admin cannot modify their own role",
      });
    }

    // Validate role
    const allowedRoles = ["user", "admin", "moderator", "writer"];
    if (!role || !allowedRoles.includes(role.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Allowed roles are: " + allowedRoles.join(", "),
      });
    }

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Store old role for audit log
    const oldRole = user.accessLevel;

    // Update user role
    user.accessLevel = role.toLowerCase();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: {
        userId: user._id,
        oldRole,
        newRole: role.toLowerCase(),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export {
  adminModerateRemedy,
  getAllUsers,
  deleteUser,
  userAccountStatus,
  changeUserRole,
};

import mongoose from "mongoose";
import Remedy from "../models/remedy.model.js";
import { remedyValidation } from "../validations/remedy.validation.js";
import ModerationStatus from "./../models/moderation_status.model.js";
import Flag from "../models/flag.model.js";
import Comment from "../models/comment.model.js";
import {
  createCommentValidation,
  moderateCommentValidation,
} from "../validations/comment.validation.js";

const createRemedy = async (req, res) => {
  try {
    const user = req.user;
    // const { error } = remedyValidation.validate(req.body);
    // if (error) {
    //   return res.status(400).json({
    //     message: "Validation error",
    //     success: false,
    //     details: error.details.map((d) => d.message),
    //   });
    // }

    const newRemedy = await Remedy.create({
      ...req.body,
      createdBy: user.id,
    });

    res.status(201).json({
      message: "Remedy successfully created",
      success: true,
      remedy: newRemedy,
    });
  } catch (error) {
    console.error("Error creating remedy:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

const getAllRemedies = async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    // Build search query
    const searchQuery = {};
    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        // { ingredients: { $regex: search, $options: "i" } },
        { "createdBy.username": { $regex: search, $options: "i" } },
      ];
    }

    // Add filters for active remedies only
    // searchQuery.isActive = true;
    // searchQuery.moderationStatus = 'approved';

    const [remedies, totalRemedies] = await Promise.all([
      Remedy.find(searchQuery)
        .populate("createdBy", "username email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Remedy.countDocuments(searchQuery),
    ]);

    res.status(200).json({
      success: true,
      message: "Successfully fetched remedies",
      page,
      limit,
      totalRemedies,
      totalPages: Math.ceil(totalRemedies / limit),
      hasNextPage: page < Math.ceil(totalRemedies / limit),
      hasPrevPage: page > 1,
      search,
      remedies,
    });
  } catch (error) {
    console.error("Error fetching remedies:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

const getRemedyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid remedy ID", success: false });
    }

    const remedy = await Remedy.findById(id).populate(
      "createdBy",
      "username email profileImage status"
    );
    if (!remedy || !remedy.isActive) {
      return res
        .status(404)
        .json({ message: "Remedy not found or deleted", success: false });
    }

    res.status(200).json({
      message: "Successfully fetched remedy",
      remedy,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

const updateRemedy = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid remedy ID", success: false });
    }

    // const { error } = remedyValidation.validate(req.body);
    // if (error) {
    //   return res.status(400).json({
    //     message: "Validation error",
    //     details: error.details,
    //     success: false,
    //   });
    // }

    const remedy = await Remedy.findById(id);
    if (!remedy) {
      return res
        .status(404)
        .json({ message: "Remedy not found or inactive", success: false });
    }

    const user = req.user;
    if (
      user.id.toString() !== remedy.createdBy.toString() &&
      user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Permission denied", success: false });
    }

    Object.assign(remedy, req.body);
    await remedy.save();

    res.status(200).json({
      message: "Remedy successfully updated",
      remedy,
      success: true,
    });
  } catch (error) {
    console.error("Error updating remedy:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

const deleteRemedy = async (req, res) => {
  try {
    const { id } = req.params;
    const remedy = await Remedy.findById(id);
    if (!remedy || !remedy.isActive) {
      return res.status(404).json({
        message: "Remedy not found or already deleted",
        success: false,
      });
    }

    const deletedRemedy = await Remedy.findByIdAndDelete(id);

    res.status(200).json({
      message: "Remedy successfully deleted",
      success: true,
      id: deletedRemedy._id,
    });
  } catch (error) {
    console.error("Error soft deleting remedy:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const flagRemedy = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, note } = req.body;

    // Input validation
    if (!reason?.trim() || !note?.trim()) {
      return res.status(400).json({
        message: "Reason, note, and category are required.",
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid remedy ID.",
        success: false,
      });
    }

    // Find the remedy
    const remedy = await Remedy.findById(id);
    if (!remedy) {
      return res.status(404).json({
        message: "Remedy not found or already inactive.",
        success: false,
      });
    }

    // Check if user has already flagged this remedy
    const existingFlag = await Flag.findOne({
      contentId: id,
      contentType: "Remedy",
      flaggedBy: req.user.id,
    });

    if (existingFlag) {
      return res.status(400).json({
        message: "You have already flagged this remedy.",
        success: false,
      });
    }

    // Create new flag
    const flag = new Flag({
      contentId: id,
      contentType: "Remedy",
      flaggedBy: req.user.id,
      reason: reason.trim(),
      note: note.trim(),
    });

    await flag.save();

    let moderationStatus = await ModerationStatus.findOne({
      contentId: id,
      contentType: "Remedy",
    });

    if (moderationStatus) {
      moderationStatus.moderationHistory.push(flag._id);
    } else {
      moderationStatus = new ModerationStatus({
        contentId: id,
        contentType: "Remedy",
        status: "under_review",
        flags: [flag._id],
        flagCount: 1,
        activeFlagCount: 1,
        lastFlaggedAt: new Date(),
      });
      await moderationStatus.save();
    }

    // Update remedy status
    remedy.moderationStatus = "under_review";

    // Check if remedy should be deactivated based on flag count
    const FLAG_THRESHOLD = 5; // This should be configurable
    if (moderationStatus.flagCount >= FLAG_THRESHOLD) {
      remedy.isActive = false;
      remedy.deactivationReason = "Exceeded flag threshold";
    }

    await remedy.save();

    // Populate flag details for response
    await flag.populate("flaggedBy", "username email");
    await moderationStatus.populate("flags");

    res.status(200).json({
      message: "Remedy flagged successfully.",
      success: true,
      data: {
        flag,
        moderationStatus,
      },
    });
  } catch (error) {
    console.error("Error flagging remedy:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
      success: false,
    });
  }
};

// 1. Create comment or reply
const createComment = async (req, res) => {
  try {
    const { error, value } = createCommentValidation.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ message: error.details[0].message, success: false });

    const { content, remedyId, parentCommentId } = value;
    const userId = req.user.id;

    let level = 0;
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (!parent)
        return res.status(404).json({ message: "Parent comment not found" });
      level = parent.level + 1;
    }

    const comment = await Comment.create({
      content,
      remedyId,
      parentCommentId: parentCommentId || null,
      userId,
      level,
    });

    res.status(201).json(comment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create comment", error: error.message });
  }
};

export {
  flagRemedy,
  createRemedy,
  getAllRemedies,
  createComment,
  getRemedyById,
  updateRemedy,
  deleteRemedy,
};

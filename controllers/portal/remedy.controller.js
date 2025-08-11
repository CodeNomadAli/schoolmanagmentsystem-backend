import { remedyValidation } from "../../validations/remedy.validation.js";
import Remedy from "../../models/remedy.model.js";
import ModerationStatus from "../../models/moderation_status.model.js";
import Flag from "../../models/flag.model.js";
import Comment from "../../models/comment.model.js";
import Ailment from "../../models/ailment.model.js";
import { createCommentValidation } from "../../validations/comment.validation.js";
import { apiResponse } from "../../helper.js";
import slugify from "../../utils/slugify.js";
import User from "../../models/user.model.js";
import mongoose from "mongoose";
import {
  generateAiImgs,
  generateTitle,
} from "../../utils/generateAiMetadata.js";
import { uploadImageFromUrl } from "../../utils/uploadImageToCloudinary.js";

const createRemedy = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const user = req.user;
    const {
      description,
      category,
      remedyType,
      ailments,
      answeredQuestions,
      sideEffects,
      whyItWorks,
      ...rest
    } = req.body;

    // Step 1: Validate input early before external API calls
    const { error } = remedyValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      await session.abortTransaction();
      return res.status(422).json({
        errors: error.details.map((d) => d.message),
        success: false,
      });
    }

    const name = await generateTitle(description);

    // Step 2: Generate and upload image in parallel
    const filePath = await generateAiImgs(description);
    const [media] = await Promise.all([uploadImageFromUrl(filePath)]);

     console.log(media,'ffffffffffffile',filePath)
    // Step 3: Ensure ailments are created/found
    const ailmentIds = [];
    for (const ailmentName of ailments) {
      let existing = await Ailment.findOne({ slug: slugify(ailmentName) });

      if (!existing) {
        existing = await Ailment.create({
          name: ailmentName.trim(),
          createdBy: user.id,
        });
      }

      ailmentIds.push(existing._id);
    }

    // Step 4: Save remedy
    const newRemedy = await Remedy.create(
      [
        {
          name,
          description,
          category,
          media: media.data,
          createdBy: user.id,
          ailments: ailmentIds,
          answeredQuestions,
          sideEffects,
          whyItWorks,
          ...rest,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return res
      .status(201)
      .json(apiResponse(201, newRemedy, "Remedy successfully created"));
  } catch (error) {
    console.error("Error creating remedy:", error);
    await session.abortTransaction();
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  } finally {
    session.endSession();
  }
};

const getAllRemedies = async (req, res) => {
  try {
    const id = req.user.id;

    console.log(id, "user oiod ");

    const user = await User.findById(id); // ✅ Cleaner if you're querying by `_id`

    console.log(user, "user bhi jan ");

    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const searchQuery = {};
    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "createdBy.username": { $regex: search, $options: "i" } },
      ];
    }

    const [remedies, total] = await Promise.all([
      Remedy.find(searchQuery)
        .populate([
          {
            path: "createdBy",
          },
          {
            path: "category",
          },

          {
            path: "ailments",
          },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Remedy.countDocuments(searchQuery),
    ]);

    const data = {
      remedies,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };

    res
      .status(200)
      .json(apiResponse(200, data, "Successfully fetched remedies"));
  } catch (error) {
    console.error("Error fetching remedies:", error);
    res.status(500).json(apiResponse(500, null, error.message));
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

    const remedy = await Remedy.findById(id).populate([
      {
        path: "createdBy",
      },
      {
        path: "category",
      },

      {
        path: "ailments",
      },
    ]);

    if (!remedy) {
      return res
        .status(404)
        .json({ message: "Remedy not found or deleted", success: false });
    }

    res
      .status(200)
      .json(apiResponse(200, remedy, "Successfully fetched remedy"));
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

const updateRemedy = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "Invalid remedy ID", success: false });
    }

    const remedy = await Remedy.findById(id).session(session);
    if (!remedy) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ message: "Remedy not found or inactive", success: false });
    }

    const user = req.user;
    if (
      user.id.toString() !== remedy.createdBy.toString() &&
      user.role !== "admin"
    ) {
      await session.abortTransaction();
      return res
        .status(403)
        .json({ message: "Permission denied", success: false });
    }

    const { ailments } = req.body;
    const ailmentIds = [];

    if (Array.isArray(ailments)) {
      for (const ailmentName of ailments) {
        if (!ailmentName || typeof ailmentName !== "string") continue;

        let existing = await Ailment.findOne({
          slug: slugify(ailmentName),
        }).session(session);

        if (!existing) {
          existing = await Ailment.create(
            [
              {
                name: ailmentName.trim(),
                createdBy: user.id,
              },
            ],
            { session }
          );

          existing = existing[0]; // Create returns array in transaction mode
        }

        ailmentIds.push(existing._id);
      }

      req.body.ailments = ailmentIds;
    }

    Object.assign(remedy, req.body);
    await remedy.save({ session });

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json(apiResponse(200, remedy, "Successfully updated remedy"));
  } catch (error) {
    console.error("Error updating remedy:", error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

const deleteRemedy = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { id } = req.params;
    const remedy = await Remedy.findById(id).session(session);
    if (!remedy) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "Remedy not found or already deleted",
        success: false,
      });
    }

    const deletedRemedy = await Remedy.findByIdAndDelete(id, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Remedy successfully deleted",
      success: true,
      id: deletedRemedy._id,
    });
  } catch (error) {
    console.error("Error deleting remedy:", error);
    await session.abortTransaction();
    session.endSession();
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

export const approveRemedy = async (req, res) => {
  try {
    const { id } = req.params;
    const { moderationStatus } = req.body;
    if (!moderationStatus) {
      return res.status(400).json({
        message:
          "Moderation status is required and must be either 'approved' or 'rejected'",
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid remedy ID", success: false });
    }

    const remedy = await Remedy.findById(id);
    if (!remedy) {
      return res
        .status(404)
        .json({ message: "Remedy not found", success: false });
    }

    remedy.moderationStatus = moderationStatus;

    await remedy.save();

    res
      .status(200)
      .json(apiResponse(200, remedy, "Remedy approved successfully"));
  } catch (error) {
    console.error("Error approving remedy:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid remedy ID",
        success: false,
      });
    }

    const remedy = await Remedy.findById(id);
    if (!remedy) {
      return res.status(404).json({
        message: "Remedy not found",
        success: false,
      });
    }

    remedy.isActive = isActive;
    await remedy.save();

    res
      .status(200)
      .json(apiResponse(200, remedy, "Remedy status updated successfully"));
  } catch (error) {
    console.error("Error updating remedy status:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

const approveOrCancelReview = async (req, res) => {
  try {
    const { remedyId, reviewId } = req.params;
    const { approved } = req.body; // true or false

    // Check for remedy
    const remedy = await Remedy.findById(remedyId);
    if (!remedy) {
      return res.status(404).json({ message: "Remedy not found" });
    }

    // Find the review
    const review = remedy.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.approved = approved;
    await remedy.save({ validateBeforeSave: false });

    res.status(200).json({
      message: `Review ${approved ? "approved" : "disapproved"}`,
      review,
    });
  } catch (err) {
    console.error("Approval error:", err);
    res.status(500).json({ message: "Server error" });
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
  updateStatus,
  approveOrCancelReview,
};

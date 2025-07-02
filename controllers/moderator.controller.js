import Comment from "../models/comment.model.js";
import mongoose from "mongoose";
import { moderateCommentValidation } from "../validations/comment.validation.js";
import ModerationStatus from "../models/moderation_status.model.js";
import AuditLog from "../models/audit_log.model.js";
import Flag from "../models/flag.model.js";
import Remedy from "../models/remedy.model.js";
import Review from "../models/review.model.js";
import AiFeedback from "../models/ai_feedback.model.js";
import User from "../models/user.model.js";

// Constants for sorting and filtering
const SORT_FIELDS = {
  CREATED_AT: "createdAt",
  UPVOTE_COUNT: "upvoteCount",
  REPORT_COUNT: "reportCount",
  STATUS: "status",
};

const SORT_ORDERS = {
  ASC: "asc",
  DESC: "desc",
};

const STATUS_TYPES = {
  APPROVED: "approved",
  REJECTED: "rejected",
  PENDING: "pending",
};

/**
 * Get comments with filtering, sorting, and pagination
 */
const getComments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      sortBy = SORT_FIELDS.CREATED_AT,
      sortOrder = SORT_ORDERS.DESC,
      upvoteOrder,
    } = req.query;

    // Input validation
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters",
      });
    }

    if (status && !Object.values(STATUS_TYPES).includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status parameter",
      });
    }

    if (sortBy && !Object.values(SORT_FIELDS).includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sort field",
      });
    }

    if (sortOrder && !Object.values(SORT_ORDERS).includes(sortOrder)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sort order",
      });
    }

    // Build filter object
    const filter = {};

    // Search by content
    if (search) {
      filter.content = { $regex: search, $options: "i" };
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Build sort object with proper field mapping
    const sort = {};
    if (upvoteOrder) {
      sort.upvoteCount = upvoteOrder === SORT_ORDERS.DESC ? -1 : 1;
    } else {
      // Map frontend sort fields to database fields
      const sortFieldMap = {
        [SORT_FIELDS.CREATED_AT]: "createdAt",
        [SORT_FIELDS.UPVOTE_COUNT]: "upvoteCount",
        [SORT_FIELDS.REPORT_COUNT]: "reportCount",
        [SORT_FIELDS.STATUS]: "status",
      };

      const dbField = sortFieldMap[sortBy] || SORT_FIELDS.CREATED_AT;
      sort[dbField] = sortOrder === SORT_ORDERS.DESC ? -1 : 1;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Use Promise.all for parallel execution
    const [totalComments, comments] = await Promise.all([
      Comment.countDocuments(filter),
      Comment.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("userId", "username email profileImage")
        .populate("remedyId", "title ")
        .lean(),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalComments / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Prepare response data
    const responseData = {
      success: true,
      data: comments.map((comment) => ({
        ...comment,
        // Add computed fields if needed
        timeAgo: new Date(comment.createdAt).toISOString(),
        statusLabel:
          comment.status.charAt(0).toUpperCase() + comment.status.slice(1),
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalComments,
        itemsPerPage: parseInt(limit),
        hasNextPage,
        hasPrevPage,
      },
      filters: {
        applied: {
          search,
          status,
          sortBy,
          sortOrder,
        },
        available: {
          statuses: Object.values(STATUS_TYPES),
          sortFields: Object.values(SORT_FIELDS),
          sortOrders: Object.values(SORT_ORDERS),
        },
      },
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("[ModeratorGetComments] Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching comments",
      error: error.message,
    });
  }
};

/**
 * Moderate a comment (approve/reject)
 */
const moderateComment = async (req, res) => {
  try {
    const { error } = moderateCommentValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { id } = req.params;
    const { status, moderatorNote = "", rejectionReason = "" } = req.body;
    const moderatorId = req.user.id;

    // Validate comment ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID format",
      });
    }

    // Find comment
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Find or create moderation status
    let moderationStatus = await ModerationStatus.findOne({
      contentId: comment._id,
      contentType: "Comment",
    });

    if (!moderationStatus) {
      moderationStatus = new ModerationStatus({
        contentId: comment._id,
        contentType: "Comment",
        status,
        reviewedBy: moderatorId,
        reviewDate: new Date(),
        moderatorNotes: moderatorNote,
        rejectionReason:
          status === STATUS_TYPES.REJECTED ? rejectionReason : "",
        flagCount: 0,
        moderationHistory: [],
      });
    } else {
      moderationStatus.status = status;
      moderationStatus.reviewedBy = moderatorId;
      moderationStatus.reviewDate = new Date();
      moderationStatus.moderatorNotes = moderatorNote;
      if (status === STATUS_TYPES.APPROVED) {
        moderationStatus.flagCount = 0;
        moderationStatus.moderationHistory = [];
        moderationStatus.rejectionReason = "";
      } else if (status === STATUS_TYPES.REJECTED) {
        moderationStatus.rejectionReason = rejectionReason;
      }
    }

    // Update comment status
    comment.status = status;
    comment.isActive = status === STATUS_TYPES.APPROVED;

    // Create audit log
    const auditLog = new AuditLog({
      action: `Comment ${status}`,
      performedBy: moderatorId,
      contentId: comment._id,
      contentType: "Comment",
      details: {
        previousStatus: comment.status,
        newStatus: status,
        moderatorNote,
        rejectionReason:
          status === STATUS_TYPES.REJECTED ? rejectionReason : undefined,
      },
    });

    // Save all changes
    await Promise.all([
      moderationStatus.save(),
      comment.save(),
      auditLog.save(),
    ]);

    return res.status(200).json({
      success: true,
      message: `Comment successfully ${status}`,
      data: {
        comment,
        moderationStatus,
      },
    });
  } catch (error) {
    console.error("[ModerateComment] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error moderating comment",
      error: error.message,
    });
  }
};

/**
 * Get comment statistics
 */
const getCommentStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      Comment.countDocuments({ status: STATUS_TYPES.APPROVED }),
      Comment.countDocuments({ status: STATUS_TYPES.REJECTED }),
      Comment.countDocuments({ status: STATUS_TYPES.PENDING }),
      Comment.countDocuments({ status: { $exists: true } }),
    ]);

    const [approved, rejected, pending, total] = stats;

    res.status(200).json({
      success: true,
      data: {
        approved,
        rejected,
        pending,
        total,
        percentages: {
          approved: total ? ((approved / total) * 100).toFixed(1) : 0,
          rejected: total ? ((rejected / total) * 100).toFixed(1) : 0,
          pending: total ? ((pending / total) * 100).toFixed(1) : 0,
        },
      },
    });
  } catch (error) {
    console.error("[GetCommentStats] Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching comment statistics",
      error: error.message,
    });
  }
};

/**
 * Get all flags with pagination and search
 */
const getAllFlags = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Input validation
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters",
      });
    }

    // Build filter object
    const filter = {};

    // Search by content or reason
    if (search) {
      filter.$or = [
        { content: { $regex: search, $options: "i" } },
        { reason: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [totalFlags, flags] = await Promise.all([
      Flag.countDocuments(filter),
      Flag.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("flaggedBy", "username email profileImage status")
        .populate("contentId", "name description")
        .lean(),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalFlags / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Prepare response data
    const responseData = {
      success: true,
      data: flags.map((flag) => ({
        ...flag,
        timeAgo: new Date(flag.createdAt).toISOString(),
        statusLabel: flag.status.charAt(0).toUpperCase() + flag.status.slice(1),
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalFlags,
        itemsPerPage: parseInt(limit),
        hasNextPage,
        hasPrevPage,
      },
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("[GetAllFlags] Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching flags",
      error: error.message,
    });
  }
};

/**
 * Moderate a flag (resolve/dismiss)
 */
const moderateFlag = async (req, res) => {
  try {
    const id = req.params.id;
    const { status, resolutionNote } = req.body;
    const moderatorId = req.user.id;

    // Validate flag ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid flag ID format",
      });
    }

    // Validate status
    if (!["resolved", "dismissed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be either 'resolved' or 'dismissed'",
      });
    }
    const flag = await Flag.findById(id);

    if (!flag) {
      return res.status(404).json({
        success: false,
        message: "Flag not found",
      });
    }
    flag.status = status;
    flag.resolvedBy = moderatorId;
    flag.resolvedAt = new Date();
    flag.resolutionNote = resolutionNote || "";

    if (status === "resolved") {
      let contentModel;
      switch (flag.contentType) {
        case "Remedy":
          contentModel = Remedy;
          break;
        case "Review":
          contentModel = Review;
          break;
        case "AiFeedback":
          contentModel = AiFeedback;
          break;
        default:
          throw new Error("Invalid content type");
      }

      // Update content status
      await contentModel.findByIdAndUpdate(flag.contentId, {
        $set: {
          status: "rejected",
          isActive: false,
          moderationNote:
            resolutionNote || "Content removed due to flag resolution",
        },
      });
    }
    await flag.save();
    const updatedFlag = await Flag.findById(id)
      .populate("flaggedBy", "username email profileImage status")
      .populate("contentId", "name description")
      .populate("resolvedBy", "username email profileImage")
      .lean();

    return res.status(200).json({
      success: true,
      message: `Flag successfully ${status}`,
      data: updatedFlag,
    });
  } catch (error) {
    console.error("[ModerateFlag] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error moderating flag",
      error: error.message,
    });
  }
};

/**
 * Suspend a user based on flag violations
 */
const suspendUser = async (req, res) => {
  try {
    const { userId, flagId, message, status } = req.body;
    const moderatorId = req.user.id;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Validate flag ID if provided
    if (flagId && !mongoose.Types.ObjectId.isValid(flagId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid flag ID format",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.status === status) {
      return res.status(400).json({
        success: false,
        message: `User is already ${status}`,
      });
    }
    user.status = status;
    user.suspendedAt = new Date();
    user.suspendedBy = moderatorId;
    user.suspendedMessage = message || "Violation of community guidelines";

    // If flagId is provided, update the flag status
    let flag = null;
    if (flagId) {
      flag = await Flag.findById(flagId);
      if (flag) {
        flag.status = "resolved";
        flag.resolvedBy = moderatorId;
        flag.resolvedAt = new Date();
        flag.resolutionNote = `User ${status} due to violation`;
        await flag.save();
      }
    }
    await user.save();
    await flag.populate("flaggedBy", "username email status profileImage");
    return res.status(200).json({
      success: true,
      message: `User successfully ${status}`,
      data: flag,
    });
  } catch (error) {
    console.error("[SuspendUser] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error suspending user",
      error: error.message,
    });
  }
};

export {
  getComments,
  getAllFlags,
  moderateComment,
  getCommentStats,
  moderateFlag,
  suspendUser,
};

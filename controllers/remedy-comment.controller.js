import mongoose from "mongoose";
import Remedy from "../models/remedy.model.js";
import { apiResponse } from "../helper.js";


export const addComment = async (req, res) => {
  const { remedyId } = req.params;
  const { text, parentId = null } = req.body;
  const userId = req.user?.id; // assuming auth middleware

  if (!text || !text.trim()) {
    return res
      .status(400)
      .json(apiResponse(400, null, "Comment text is required"));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const remedy = await Remedy.findById(remedyId).session(session);
    if (!remedy) {
      await session.abortTransaction();
      return res.status(404).json(apiResponse(404, null, "Remedy not found"));
    }

    if (parentId) {
      const parentExists = remedy.comments.some(
        (comment) => comment._id.toString() === parentId
      );
      if (!parentExists) {
        await session.abortTransaction();
        return res
          .status(400)
          .json(apiResponse(400, null, "Parent comment not found"));
      }
    }

    const newComment = {
      user: userId,
      parentId: parentId || null,
      text: text.trim(),
    };

    remedy.comments.push(newComment);
    await remedy.save({ session, validateModifiedOnly: true });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(201)
      .json(apiResponse(201, newComment, "Comment added successfully"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json(apiResponse(500, null, error.message || "Server error"));
  }
};


export const updateComment = async (req, res) => {
  const { remedyId } = req.params;
  const { commentId, text } = req.body;
  const userId = req.user.id; // ✅ guaranteed by auth middleware

  if (!text || !text.trim()) {
    return res
      .status(400)
      .json(apiResponse(400, null, "Comment text is required"));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const remedy = await Remedy.findById(remedyId).session(session);

    if (!remedy) {
      await session.abortTransaction();
      return res.status(404).json(apiResponse(404, null, "Remedy not found"));
    }

    const comment = remedy.comments.id(commentId);
    
    if (comment.user.toString() !== userId.toString()) {
      throw new Error("Not authorized");
    }

    if (!comment) {
      await session.abortTransaction();
      return res.status(404).json(apiResponse(404, null, "Comment not found"));
    }

    comment.text = text.trim();
    comment.updatedAt = new Date();

    await remedy.save({ session, validateModifiedOnly: true });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(apiResponse(200, comment, "Comment updated successfully"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json(apiResponse(500, null, error.message || "Server error"));
  }
};

export const getComments = async (req, res) => {
  const { remedyId } = req.params;

  try {
    const remedy = await Remedy.findById(remedyId)
      .populate("comments.user", "name email")
      .lean();

    if (!remedy) {
      return res.status(404).json(apiResponse(404, null, "Remedy not found"));
    }

    // Group comments & replies
    const commentsMap = {};
    const topLevel = [];

    remedy.comments.forEach((comment) => {
      comment.replies = [];
      commentsMap[comment._id] = comment;
    });

    remedy.comments.forEach((comment) => {
      if (comment.parentId) {
        commentsMap[comment.parentId]?.replies.push(comment);
      } else {
        topLevel.push(comment);
      }
    });

    return res
      .status(200)
      .json(apiResponse(200, topLevel, "Comments fetched successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(apiResponse(500, null, error.message || "Server error"));
  }
};


export const deleteComments = async (req, res) => {
  const { remedyId } = req.params;
  const { commentId } = req.body;
  const userId = req.user.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const remedy = await Remedy.findById(remedyId).session(session);

    if (!remedy) {
      await session.abortTransaction();
      return res.status(404).json(apiResponse(404, null, "Remedy not found"));
    }

    const comment = remedy.comments.id(commentId);

    if (!comment) {
      await session.abortTransaction();
      return res.status(404).json(apiResponse(404, null, "Comment not found"));
    }

    if (comment.user.toString() !== userId.toString()) {
      await session.abortTransaction();
      return res
        .status(403)
        .json(apiResponse(403, null, "Not authorized to delete this comment"));
    }

    if (!comment.parentId) {
      
      remedy.comments = remedy.comments.filter(
        (c) =>
          c._id.toString() !== commentId.toString() &&
          c.parentId?.toString() !== commentId.toString()
      );
    } else {
      
      remedy.comments = remedy.comments.filter(
        (c) => c._id.toString() !== commentId.toString()
      );
    }

    await remedy.save({ session, validateModifiedOnly: true });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(apiResponse(200, null, "Comment deleted successfully"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json(apiResponse(500, null, error.message || "Server error"));
  }
};

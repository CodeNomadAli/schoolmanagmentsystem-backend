import Notification from "../models/notificaton_preferences.model.js";
import { apiResponse } from "../helper.js";

// ---------------- CREATE ----------------
export const addNotification = async (req, res) => {
  try {
    const {
      title,
      shortCode,
      postedBy,
      department,
      message,
      type,
      targetAudience,
    } = req.body;

    const school_id = req.user.school_id;
    const readBy = [req.user.userId]; // ✅ always store as array

    const notification = await Notification.create({
      title,
      shortCode,
      postedBy,
      department,
      message,
      type,
      targetAudience,
      school_id,
      readBy,
    });

    return res
      .status(201)
      .json(apiResponse(201, notification, "Notification added successfully"));
  } catch (err) {
    console.error("Add notification error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- GET ALL ----------------
export const getNotifications = async (req, res) => {
  try {
    const school_id = req.user.school_id;
    const userId = req.user._id; // ✅ fix: use _id (not userId)

    const notifications = await Notification.find({ school_id })
      .sort({ createdAt: -1 });

    // ✅ Add isRead field
    const formatted = notifications.map((n) => ({
      ...n._doc,
      isRead: n.readBy.includes(userId),
    }));

    return res
      .status(200)
      .json(apiResponse(200, formatted, "Notifications fetched successfully"));
  } catch (err) {
    console.error("Get notifications error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- MARK AS READ ----------------
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Notification not found"));
    }

    if (!notification.readBy.includes(userId)) {
      notification.readBy.push(userId);
      await notification.save();
    }

    return res
      .status(200)
      .json(apiResponse(200, notification, "Notification marked as read"));
  } catch (err) {
    console.error("Mark notification as read error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json(apiResponse(404, null, "Notification not found"));
    }

    // await notification.remove();zz

    return res
      .status(200)
      .json(apiResponse(200, null, "Notification deleted successfully"));
  } catch (err) {
    console.error("Delete notification error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};
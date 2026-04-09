import express from "express";
import {
  addNotification,
  getNotifications,
  markAsRead,
  deleteNotification
} from "../controllers/notification.controller.js";
import  authMiddleware  from "../middleware/auth.middleware.js"; // assuming you have auth

const router = express.Router();

// Add notification (admin/teacher)
router.post("/", authMiddleware, addNotification);

// Get all notifications for school/user
router.get("/", authMiddleware, getNotifications);
router.delete("/:id", authMiddleware, deleteNotification);


// Mark notification as read
router.put("/read/:notificationId", authMiddleware, markAsRead);

export default router;
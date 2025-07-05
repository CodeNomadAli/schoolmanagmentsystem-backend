import express from "express";
import {
  adminModerateRemedy,
  changeUserRole,
  deleteUser,
  getAllUsers,
  userAccountStatus,
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.patch("/moderate/remedy/:id", adminModerateRemedy);

// GET /users - Get all users
adminRouter.get("/users", getAllUsers);

// DELETE /users/:id - Delete a user by ID
adminRouter.delete("/users/:id", deleteUser);

// POST /users/status - Change user account status
adminRouter.post("/users/status", userAccountStatus);

// POST /users/role - Change user role
adminRouter.post("/users/role", changeUserRole);

export default adminRouter;

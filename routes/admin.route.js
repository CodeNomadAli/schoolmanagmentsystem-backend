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

// user routes
adminRouter.get("/users", getAllUsers);
adminRouter.delete("/users/:id", deleteUser);
adminRouter.post("/users/status", userAccountStatus);
adminRouter.post("/users/role", changeUserRole);

export default adminRouter;

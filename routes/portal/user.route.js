import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  suspendUser,
  warnUser,
  createUser
} from "../controllers/user.controller.js";
import checkPermission from "../middleware/check_permission.middleware.js";


const router = express.Router();

router.post("/register", checkPermission("create-users"), registerUser);
router.post("/login", checkPermission("login-users"), loginUser);
router.get("/", checkPermission("read-users"),getAllUsers);
router.get("/:id", checkPermission("read-users"), getUserById);
router.put("/:id", checkPermission("update-users"), updateUser);
router.delete("/:id", checkPermission("delete-users"), deleteUser);
router.post("/:id/suspend", checkPermission("suspend-users"), suspendUser);
router.post("/:id/warn", checkPermission("warn-users"), warnUser);
router.post("/create", checkPermission("create-users"), createUser);


export default router;

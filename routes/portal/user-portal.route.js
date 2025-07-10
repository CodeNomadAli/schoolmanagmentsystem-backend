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
} from "../../controllers/user.controller.js";
import checkPermission from "../../middleware/check_permission.middleware.js";


const router = express.Router();
// portal routes

router.get("/", checkPermission("read-users"), getAllUsers);
router.get("/:id", checkPermission("read-users"), getUserById);
router.post("/create", checkPermission("create-users"), createUser);
router.put("/:id", checkPermission("update-users"), updateUser);
router.delete("/:id", checkPermission("delete-users"), deleteUser);

export default router;

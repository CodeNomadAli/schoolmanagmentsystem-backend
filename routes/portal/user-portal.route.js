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
} from "../../controllers/portal/user.controller.js";
import checkPermission from "../../middleware/check_permission.middleware.js";


const router = express.Router();
// portal routes

router.get("/", checkPermission("read-user"), getAllUsers);
router.get("/:id", checkPermission("read-user"), getUserById);
router.post("/create", checkPermission("create-user"), createUser);
router.put("/:id", checkPermission("update-user"), updateUser);
router.delete("/:id", checkPermission("delete-user"), deleteUser);

export default router;

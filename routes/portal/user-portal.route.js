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

router.get("/portal/users", checkPermission("read-users"), getAllUsers);
router.get("/portal/users/:id", checkPermission("read-users"), getUserById);
router.post("/portal/users", checkPermission("create-users"), createUser);
router.put("/portal/users/:id", checkPermission("update-users"), updateUser);
router.delete("/portal/users/:id", checkPermission("delete-users"), deleteUser);
router.post("/portal/users/:id/suspend", checkPermission("suspend-users"), suspendUser);
router.post("/portal/users/:id/warn", checkPermission("warn-users"), warnUser);

export default router;

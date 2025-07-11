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
} from "../controllers/portal/user.controller.js";
import checkPermission from "../middleware/check_permission.middleware.js";


const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/",getAllUsers);
router.get("/:id",getUserById);
router.put("/:id",updateUser);
router.delete("/:id",deleteUser);
router.post("/:id/suspend",suspendUser);
router.post("/:id/warn", warnUser);
router.post("/create", createUser);





export default router;

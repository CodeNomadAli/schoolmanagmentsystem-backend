import express from "express"
import multer from "multer"
import { upsertUserProfile, getUserProfile } from "../controllers/user.profile.controller.js"
import optionalAuth from "../middleware/auth.middleware.js"

const router = express.Router()
const upload = multer() // memory storage

router.post("/", optionalAuth, upload.single("profileImage"), upsertUserProfile)
router.get("/", optionalAuth, getUserProfile)

export default router
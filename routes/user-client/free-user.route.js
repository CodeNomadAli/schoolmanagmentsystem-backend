import express from "express";
import { getFreeUserDashboard , getAllFreeUsers,bookmarkRemedy,removeBookmarkRemedy,bookmarkCategory,removeBookmarkCategory } from "../../controllers/user_client/freeUser.contoller.js";

const router = express.Router();

router.get("/dashboard/:userId", getFreeUserDashboard);

router.get("/", getAllFreeUsers);

router.post("/remedy/bookmark/:remedyId", bookmarkRemedy);

router.delete("/remedy/unbookmark/:remedyId", removeBookmarkRemedy);

router.post("/category/bookmark/:categoryId", bookmarkCategory);

router.delete("/category/unbookmark/:categoryId", removeBookmarkCategory);

export default router;

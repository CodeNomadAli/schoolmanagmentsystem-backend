import express from "express";
import {
  createArticleCategory,
  getAllArticleCategories,
  getArticleCategoryById,
  updateArticleCategory,
  deleteArticleCategory,
} from "../../controllers/portal/articleCategory.controller.js"
import checkPermission from "../../middleware/check_permission.middleware.js";
const router = express.Router();

router.post("/create",checkPermission('create-article'), createArticleCategory);
router.get("/",checkPermission('read-article'), getAllArticleCategories);
router.get("/:id",checkPermission('read-article'), getArticleCategoryById);
router.put("/:id",checkPermission('update-article'), updateArticleCategory);
router.delete("/:id",checkPermission('delete-article'), deleteArticleCategory);

export default router;

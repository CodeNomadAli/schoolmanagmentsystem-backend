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

router.post("/",checkPermission('create-article-category'), createArticleCategory);
router.get("/",checkPermission('read-article-category'), getAllArticleCategories);
router.get("/:id",checkPermission('read-article-category'), getArticleCategoryById);
router.put("/:id",checkPermission('update-article-category'), updateArticleCategory);
router.delete("/:id",checkPermission('delete-article-category'), deleteArticleCategory);

export default router;

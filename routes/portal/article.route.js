import express from "express";
import {
  checkSlugUniqueness,
  createArticle,
  deleteArticle,
  generateSlug,
  getArticleById,
  getArticlesByWriterId,
  updateArticle,
  getAllArticles,
  getArticleBySlug,
} from "../../controllers/portal/article.controller.js";
import checkPermission from "../../middleware/check_permission.middleware.js";
const ArticleRouter = express.Router();

// create Article route
ArticleRouter.post("/",checkPermission('create-article'), createArticle);
// delete article route
ArticleRouter.delete("/:id",checkPermission('delete-article'), deleteArticle);
// get all articles with author
ArticleRouter.get("/author",checkPermission('read-article'), getArticlesByWriterId);
// get single article route
ArticleRouter.get("/:id",checkPermission('read-article'), getArticleById);
// update article
ArticleRouter.put("/:id",checkPermission('update-article'), updateArticle);
// check slug uniqueness
ArticleRouter.get("/check-slug/:slug",checkPermission('create-article'), checkSlugUniqueness);
// generate slug
ArticleRouter.post("/generate-slug",checkPermission('create-article'), generateSlug);

ArticleRouter.get("/",checkPermission('read-article'), getAllArticles);

ArticleRouter.get("/:slug",checkPermission('read-article'),getArticleBySlug)


export default ArticleRouter;

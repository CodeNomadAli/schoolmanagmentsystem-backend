import express from "express";
import {
  checkSlugUniqueness,
  createArticle,
  deleteArticle,
  generateSlug,
  getArticleById,
  getArticlesByWriterId,
  updateArticle,
} from "../controllers/article.controller.js";
import checkPermission from "../middleware/check_permission.middleware.js";
const WriterRouter = express.Router();

// create Article route
WriterRouter.post("/articles/",checkPermission('create-article'), createArticle);
// delete article route
WriterRouter.delete("/articles/:id",checkPermission('delete-article'), deleteArticle);
// get all articles with author
WriterRouter.get("/articles/author",checkPermission('read-article'), getArticlesByWriterId);
// get single article route
WriterRouter.get("/articles/:id",checkPermission('read-article'), getArticleById);
// update article
WriterRouter.put("/articles/:id",checkPermission('update-article'), updateArticle);
// check slug uniqueness
WriterRouter.get("/articles/check-slug/:slug",checkPermission('check-slug'), checkSlugUniqueness);
// generate slug
WriterRouter.post("/articles/generate-slug",checkPermission('generate-slug'), generateSlug);

export default WriterRouter;

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

const WriterRouter = express.Router();

// create Article route
WriterRouter.post("/articles/", createArticle);
// delete article route
WriterRouter.delete("/articles/:id", deleteArticle);
// get all articles with author
WriterRouter.get("/articles/author", getArticlesByWriterId);
// get single article route
WriterRouter.get("/articles/:id", getArticleById);
// update article
WriterRouter.put("/articles/:id", updateArticle);
// check slug uniqueness
WriterRouter.get("/articles/check-slug/:slug", checkSlugUniqueness);
// generate slug
WriterRouter.post("/articles/generate-slug", generateSlug);

export default WriterRouter;

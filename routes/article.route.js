import express from "express";
import { getAllArticles, getArticleBySlug } from "../controllers/article.controller.js";

const ArticleRouter = express.Router();

// get all articles route
ArticleRouter.get("/", getAllArticles);
ArticleRouter.get("/:slug",getArticleBySlug)

export default ArticleRouter;

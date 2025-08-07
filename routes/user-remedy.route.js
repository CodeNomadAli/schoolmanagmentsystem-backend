import {
  getAllRemedies,
  getRemedyById,
  toggleBookmark,
  getBookmarkedRemedies
} from "../controllers/user-remedy.controller.js";

import express from "express";

const RemedyRouter = express.Router();

RemedyRouter.get("/", getAllRemedies);

RemedyRouter.put("/bookmark", toggleBookmark);

RemedyRouter.get("/bookmark",getBookmarkedRemedies);

RemedyRouter.get("/:id", getRemedyById);

export default RemedyRouter;

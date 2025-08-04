import {
  getAllRemedies,
  getRemedyById,
  getBookmarkedRemedies,
  toggleBookmark,
} from "../controllers/user-remedy.controller.js";

import express from "express";

const RemedyRouter = express.Router();


RemedyRouter.put("/mark", toggleBookmark);
RemedyRouter.get("/bookmark", getBookmarkedRemedies);

// 🧪 Remedy general routes
RemedyRouter.get("/", getAllRemedies);
RemedyRouter.get("/:id", getRemedyById);

export default RemedyRouter;

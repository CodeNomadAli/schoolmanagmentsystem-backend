import {
  getAllRemedies,
  getRemedyById,
  getBookmarkedRemedies,
  toggleBookmark,

  
} from "../controllers/user-remedy.controller.js";

import express from "express";

const RemedyRouter = express.Router();


RemedyRouter.get("/", getAllRemedies);

RemedyRouter.put("/mark", toggleBookmark);

RemedyRouter.get("/bookmark", getBookmarkedRemedies);





RemedyRouter.get("/:id", getRemedyById);



export default RemedyRouter;

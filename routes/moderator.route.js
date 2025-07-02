import express from "express";
import {
  getAllFlags,
  getComments,
  moderateFlag,
  suspendUser,
} from "../controllers/moderator.controller.js";

const ModeratorRoute = express.Router();
// get all comments route 
ModeratorRoute.get("/comments", getComments);
// get all flags route
ModeratorRoute.get("/flags", getAllFlags);
// moderate flag content route
ModeratorRoute.post("/flags/:id",moderateFlag)
// moderator suspend user
ModeratorRoute.post("/users/status",suspendUser );


export default ModeratorRoute;

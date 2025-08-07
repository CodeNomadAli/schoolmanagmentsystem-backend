import {
  getAllRemedies,

  getViewDetailsRemdy,
} from "../controllers/public-remedy.controller.js";
import express from "express";
import auth from "../middleware/auth.middleware.js";

const Remedy = express.Router();



Remedy.get("/", getAllRemedies);

Remedy.get("/:slug",auth,getViewDetailsRemdy);

export default Remedy;

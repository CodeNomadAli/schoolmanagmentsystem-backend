import express from "express";
import timeout from 'connect-timeout';

import {
  createRemedy,
  deleteRemedy,
  getAllRemedies,
  flagRemedy,
  getRemedyById,
  updateRemedy,
  createComment,
  approveRemedy,
  updateStatus,
  approveOrCancelReview
} from "../../controllers/portal/remedy.controller.js";

import checkPermission from "../../middleware/check_permission.middleware.js";



const RemedyRouter = express.Router();
// create remedy route
RemedyRouter.post("/create",timeout('60s'),checkPermission("create-remedy"), createRemedy);
// get all remedy
RemedyRouter.get("/", checkPermission("read-remedy"), getAllRemedies);
// get remedy by id
RemedyRouter.get("/:id", checkPermission("read-remedy"), getRemedyById);
// remedy flag route
RemedyRouter.post("/flag/:id", checkPermission("update-remedy"), flagRemedy);
// update remedy by id
RemedyRouter.put("/:id", checkPermission("update-remedy"), updateRemedy);
// delete remedy by id
RemedyRouter.delete("/:id", checkPermission("delete-remedy"), deleteRemedy);

RemedyRouter.put("/approve/:id", checkPermission("approve-remedy"), approveRemedy);

RemedyRouter.put("/status/:id", checkPermission("approve-remedy"), updateStatus);

RemedyRouter.put("/:remedyId/:reviewId",checkPermission("approve-review"), approveOrCancelReview);

// add comment or reply to remedy
RemedyRouter.post("/comment", checkPermission("create-remedy"), createComment);

export default RemedyRouter;

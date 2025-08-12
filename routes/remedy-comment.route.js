
import express from "express";

import { addComment, getComments,updateComment,deleteComments } from "../controllers/remedy-comment.controller.js";

import auth from "../middleware/auth.middleware.js";


const router = express.Router();


router.get("/:remedyId", getComments);

router.put("/:remedyId", auth, addComment);

router.put("/commet/:remedyId", auth, updateComment);

router.delete("/:remedyId", auth, deleteComments);

export default router;

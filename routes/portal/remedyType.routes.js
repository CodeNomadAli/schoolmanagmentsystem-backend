import express from "express";
import {
  createRemedyType,
  getAllRemedyTypes,
  updateRemedyType,
  deleteRemedyType,
  getRemedyTypesById, // Assuming this is to get by ID
} from "../../controllers/remedyType.controller.js";
import checkPermission from "../../middleware/check_permission.middleware.js";
const router = express.Router();

router.post("/create", checkPermission("create-remedy"), createRemedyType);
router.get("/", checkPermission("read-remedy"), getAllRemedyTypes);
router.get("/:id", checkPermission("read-remedy"), getRemedyTypesById); // Assuming this is to get by ID
router.put("/:id", checkPermission("update-remedy"), updateRemedyType);
router.delete("/:id", checkPermission("delete-remedy"), deleteRemedyType);

export default router;

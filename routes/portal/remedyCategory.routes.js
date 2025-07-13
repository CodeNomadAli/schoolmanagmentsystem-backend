import express from "express";
import {
  createRemedyCategory,
  getAllRemedyCategories,
  updateRemedyCategory,
  deleteRemedyCategory,
    getCategoriesById,
} from "../../controllers/portal/remedyCategory.controller.js";
import checkPermission from "../../middleware/check_permission.middleware.js";

const router = express.Router();

router.post("/create", checkPermission("create-category"), createRemedyCategory);
router.get("/", checkPermission("read-category"), getAllRemedyCategories);
router.get("/:id", checkPermission("read-category"), getCategoriesById);
router.put("/:id", checkPermission("update-category"), updateRemedyCategory);
router.delete("/:id", checkPermission("delete-category"), deleteRemedyCategory);

export default router;

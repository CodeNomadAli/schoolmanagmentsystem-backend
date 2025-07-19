import express from "express";
import {
  createAilment,
  getAllAilments,
  getAilment,
  updateAilment,
  deleteAilment,
} from "../../controllers/portal/ailment.controller.js";
import checkPermission from "../../middleware/check_permission.middleware.js";

const router = express.Router();

router.post("/create",checkPermission("create-ailment"), createAilment);
router.get("/",checkPermission("read-ailment"), getAllAilments);
router.get("/:id",checkPermission("read-ailment"), getAilment);
router.put("/:id",checkPermission("update-ailment"), updateAilment);
router.delete("/:id",checkPermission("delete-ailment"), deleteAilment);

export default router;

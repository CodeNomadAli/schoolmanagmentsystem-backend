import express from "express";
import {
  getPrivacyPolicyById,
  createPrivacyPolicy,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
  getAllPrivacyPolicies
} from "../../controllers/portal/web-policy.controller.js";
import checkPermission from "../../middleware/check_permission.middleware.js";


const router = express.Router();

router.post("/create", checkPermission("create-web-policy"), createPrivacyPolicy);
router.get("/",checkPermission("read-web-policy"),getAllPrivacyPolicies)
router.get("/:id",checkPermission("read-web-policy"),getPrivacyPolicyById)
router.put("/:id",checkPermission("update-web-policy"),updatePrivacyPolicy)
router.delete("/:id",checkPermission("delete-web-policy"),deletePrivacyPolicy)

export default router;

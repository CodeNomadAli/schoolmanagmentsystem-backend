import express from "express";
import {
  getPrivacyPolicyById,
  createPrivacyPolicy,
  updatePrivacyPolicy,
    deletePrivacyPolicy,
    getAllPrivacyPolicies
  
} from "../../controllers/portal/Privacy.controller.js";
import checkPermission from "../../middleware/check_permission.middleware.js";


const router = express.Router();

router.post("/create", checkPermission("create-privacy-policy"), createPrivacyPolicy);
router.get("/",checkPermission("read-privacy-policy"),getAllPrivacyPolicies)
router.get("/:id",checkPermission("read-privacy-policy"),getPrivacyPolicyById)
router.put("/:id",checkPermission("update-privacy-policy"),updatePrivacyPolicy)
router.delete("/:id",checkPermission("delete-privacy-policy"),deletePrivacyPolicy)

export default router;
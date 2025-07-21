import { check } from "zod/v4";
import {
  getPrivacyPolicyById,
  createPrivacyPolicy,
  updatePrivacyPolicy,
  getPrivacyPolicyById,
  deletePrivacyPolicy,
} from "../../controllers/portal/Privacy.controller";
import checkPermission from "../../middleware/check_permission.middleware";


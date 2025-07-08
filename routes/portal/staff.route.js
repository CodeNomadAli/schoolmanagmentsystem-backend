import express from "express";
import {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff
} from "../../controllers/staff.controller.js";
import checkPermission from "../../middleware/check_permission.middleware.js";

const router = express.Router();


router.post("/create",checkPermission("create-staff"), createStaff);         
router.get("/", checkPermission("read-staff"), getAllStaff);          
router.get("/:id", checkPermission("read-staff"), getStaffById);      
router.put("/:id", checkPermission("update-staff"), updateStaff);       
router.delete("/:id", checkPermission("delete-staff"), deleteStaff);    

export default router;

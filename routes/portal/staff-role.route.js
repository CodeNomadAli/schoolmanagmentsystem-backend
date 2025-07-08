import express from "express";
import {
  createStaffRole,
  getAllStaffRoles,
  fetchRoleById,
  updateStaffRole,
  deleteStaffRole,
  
} from "../../controllers/staff-roles.controller.js";

const router = express.Router();


router.post("/", createStaffRole);         
router.get("/", getAllStaffRoles);          
router.get("/:id", fetchRoleById);      
router.put("/:id", updateStaffRole);       
router.delete("/:id", deleteStaffRole);    

export default router;

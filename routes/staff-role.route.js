import express from "express";
import {
  // createStaff,
  getAllStaffRoles,
  fetchRoleById,
  // updateStaff,
  // deleteStaff,
  
} from "../controllers/staff-roles.controller.js";

const router = express.Router();


// router.post("/create", createStaff);         
router.get("/", getAllStaffRoles);          
router.get("/:id", fetchRoleById);      
// router.put("/:id", updateStaff);       
// router.delete("/:id", deleteStaff);    

export default router;

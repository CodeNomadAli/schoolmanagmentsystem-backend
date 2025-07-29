import express from "express";
import {
  // createStaff,
  getAllStaffPermissions,
//   fetchRoleById,
  // updateStaff,
  // deleteStaff,
  
} from "../../controllers/portal/staff-permissions.controller.js";

const router = express.Router();


// router.post("/create", createStaff);         
router.get("/", getAllStaffPermissions);          
// router.get("/:id", fetchRoleById);      
// router.put("/:id", updateStaff);       
// router.delete("/:id", deleteStaff);    

export default router;

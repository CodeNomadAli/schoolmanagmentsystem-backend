import jwt from "jsonwebtoken";
import Staff from "../models/staff.model.js";
import Permission from "../models/permission.model.js";
import StaffRole from "../models/staff_role.model.js"; // Ensure this matches the Role model name

const staffAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const staff = await Staff.findById(decoded.userId)
      .populate({
        path: "staffRoleId",
      });

    if (!staff) {
      return res.status(401).json({ message: "Access denied. Staff not found." });
    }

    
    const permissionNames = (staff.staffRoleId?.permissions || []).map(
      (perm) => perm.name.toLowerCase()
    );

    // Attach user data to request
    req.user = {
      id: staff._id,
      email: staff.email,
      role: staff.accessLevel,
    };

    req.token = token;
    next();
  } catch (err) {
    console.error("staffAuth error:", err);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default staffAuth;

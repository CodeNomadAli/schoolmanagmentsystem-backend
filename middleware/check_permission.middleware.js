import jwt from "jsonwebtoken";
import Staff from "../models/staff.model.js"; 
import Permission from "../models/permission.model.js";



const checkPermission = (permissionKey) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided." });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("Decoded JWT:", decoded);

      const staff = await Staff.findById(decoded.userId).populate({
        path: "staffRoleId",
        populate: {
          path: "permissions", 
          model: "staff_Permission",
        },
      });

      if (!staff) {
        return res.status(401).json({ message: "Access denied. staff not found." });
      }

      const havePermission = staff.staffRoleId?.permissions?.find(p => p.slug === permissionKey) || null;

      if (!havePermission) {
        return res.status(403).json({ message: `Forbidden: Missing permission: ${permissionKey}` });
      }

      req.user = staff; 
      next();
    } catch (err) {
      return res.status(500).json({ message: "Server error in permission check.", error: err.message });
    }
  };
};

export default checkPermission;

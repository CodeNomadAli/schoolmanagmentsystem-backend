import jwt from "jsonwebtoken";
import Staff from "../models/staff.model.js";

const staffAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Staff.findById(decoded.id); 

    if (!user) {
      return res.status(401).json({ message: "Access denied. User not found." });
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.accessLevel,
    };
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default staffAuth;

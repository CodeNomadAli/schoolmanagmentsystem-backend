// middleware/optionalAuth.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(); // Guest user → no blocking
    }


    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(); // Treat as guest if user not found
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.accessLevel,
    };
    req.token = token;

    next();
  } catch (err) {
    // Invalid token? Ignore and continue as guest
    return next();
  }
};

export default optionalAuth;

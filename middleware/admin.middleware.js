const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user || req.user.role === "user") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Admin check failed.", error: error.message });
  }
};

export default adminMiddleware;

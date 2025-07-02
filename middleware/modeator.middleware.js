const moderatorMiddleware = (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "moderator") {
        return res.status(403).json({ message: "Access denied. Moderator only." });
      }
      next();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Moderator check failed.", error: error.message });
    }
  };
  
  export default moderatorMiddleware;
  
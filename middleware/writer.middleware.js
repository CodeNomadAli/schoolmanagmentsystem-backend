const writerMiddleware = (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "writer") {
        return res.status(403).json({ message: "Access denied. Writer only." });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Writer check failed.", error: error.message });
    }
  };
  
  export default writerMiddleware;
  
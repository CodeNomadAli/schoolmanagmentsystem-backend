const writerMiddleware = (req, res, next) => {
  try {

    console.log(req,"this are the writer ")
    if (!req.user || req.user.accessLevel !== "writer") {
      return res.status(403).json({ message: "Access denied. Writers only." });
    }

    console.log(req.user.accessLevel, "Access level checked");

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Writer check failed.", error: error.message });
  }
};

export default writerMiddleware;

import Remedy from "../models/remedy.model.js";

const getRemedies = async (req, res) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const remedies = await Remedy.find({ createdBy: user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalRemedies = await Remedy.countDocuments({ createdBy: user.id });

    res.status(200).json({
      message: "Remedies retrieved successfully",
      success: true,
      remedies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRemedies / limit),
        totalRemedies,
        hasMore: skip + remedies.length < totalRemedies
      }
    });
  } catch (error) {
    console.error("Error fetching remedies:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch remedies",
      success: false,
      error: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};

export { getRemedies };

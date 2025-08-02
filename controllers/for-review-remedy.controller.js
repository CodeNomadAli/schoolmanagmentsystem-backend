
import Remedy from "../models/remedy.model.js";
import { apiResponse } from "../helper.js";


export const getAllRemedies = async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const searchQuery = {};
    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "createdBy.username": { $regex: search, $options: "i" } },
      ];
    }
    

    const [remedies, total] = await Promise.all([
      Remedy.find(searchQuery)  
      .select("name description media") 
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Remedy.countDocuments(searchQuery),
    ]);

    const data = {
      remedies,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };

    res
      .status(200)
      .json(apiResponse(200, data, "Successfully fetched remedies"));
  } catch (error) {
    console.error("Error fetching remedies:", error);
    res.status(500).json(apiResponse(500, null, error.message));
  }
};

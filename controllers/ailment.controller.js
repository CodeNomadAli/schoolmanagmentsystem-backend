import Ailment from "../models/ailment.model.js";
import { apiResponse } from "../helper.js";

export const getAllAilments = async (req, res) => {
  try {
    const ailments = await Ailment.find({}, { _id: 1, name: 1, slug: 1 }).sort({ name: 1 });

    res.status(200).json(
      apiResponse(
        200,
        ailments,
        "Successfully fetched ailments"
      )
    );
  } catch (error) {
    console.error("Error fetching ailments:", error);
    res.status(500).json(
      apiResponse(500, null, "Failed to fetch ailments")
    );
  }
};

import RemedyCategory from "../models/remedy_categories.model.js";
import { apiResponse } from "../helper.js";

export const getAllCategory = async (req, res) => {
  try {
   
    const categories = await RemedyCategory.find({}, { _id: 1, name: 1 }).sort({ name: 1 });
   
    res
      .status(200)
      .json(
        apiResponse(
          200,
           categories,
          "Successfully fetched remedy categories and ailments"
        )
      );
  } catch (error) {
    console.error("Error fetching categories and ailments:", error);
    res
      .status(500)
      .json(
        apiResponse(500, null, "Failed to fetch remedy categories and ailments")
      );
  }
};

import mongoose from "mongoose";
import RemedyCategory from "../../models/remedyCategories.model.js";
import { apiResponse } from "../../helper.js";


export const createRemedyCategory = async (req, res) => {
  try {
    const { name, description, relatedQuestions } = req.body;

    const category = await RemedyCategory.create({
      name,
      description,
      relatedQuestions,
    });

    return res
      .status(201)
      .json(apiResponse(201, category, "Category created"));
  } catch (error) {
    return res
      .status(500)
      .json(apiResponse(500, null, error.message));
  }
};


export const getAllRemedyCategories = async (req, res) => {
  try {
    const categories = await RemedyCategory.find().sort({ createdAt: -1 });

    return res
      .status(200)
      .json(apiResponse(200, categories, "All categories fetched"));
  } catch (error) {
    return res
      .status(500)
      .json(apiResponse(500, null, error.message));
  }
};


export const getCategoriesById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json(apiResponse(400, null, "Invalid ID"));
    }

    const category = await RemedyCategory.findById(id);

    if (!category) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Category not found"));
    }

    return res
      .status(200)
      .json(apiResponse(200, category, "Category found"));
  } catch (error) {
    return res
      .status(500)
      .json(apiResponse(500, null, error.message));
  }
};


export const updateRemedyCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json(apiResponse(400, null, "Invalid ID"));
    }

    const category = await RemedyCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!category) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Category not found"));
    }

    return res
      .status(200)
      .json(apiResponse(200, category, "Category updated"));
  } catch (error) {
    return res
      .status(500)
      .json(apiResponse(500, null, error.message));
  }
};


export const deleteRemedyCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json(apiResponse(400, null, "Invalid ID"));
    }

    const category = await RemedyCategory.findByIdAndDelete(id);

    if (!category) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Category not found"));
    }

    return res
      .status(200)
      .json(apiResponse(200, { id: category._id }, "Category deleted"));
  } catch (error) {
    return res
      .status(500)
      .json(apiResponse(500, null, error.message));
  }
};

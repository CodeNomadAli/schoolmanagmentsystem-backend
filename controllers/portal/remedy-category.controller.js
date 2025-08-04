import mongoose from "mongoose";
import RemedyCategory from "../../models/remedy_categories.model.js";
import { apiResponse } from "../../helper.js";


export const createRemedyCategory = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { name, description, relatedQuestions } = req.body;

    const exist = await RemedyCategory.findOne({ name }).session(session);
    if (exist) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(409)
        .json(apiResponse(409, null, "Category with this name already exists"));
    }

    const [category] = await RemedyCategory.create([{
      name,
      description,
      relatedQuestions,
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(201)
      .json(apiResponse(201, category, "Category created successfully"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json(apiResponse(500, null, error.message));
  }
};



export const getAllRemedyCategories = async (req, res) => {
  try {
    const limit = req.query.limit
      ? Math.min(Math.max(parseInt(req.query.limit), 1), 100)
      : undefined;
    const page = req.query.page
      ? Math.max(parseInt(req.query.page), 1)
      : undefined;
    const skip = page && limit ? (page - 1) * limit : undefined;

    const [categories, total] = await Promise.all([
      RemedyCategory.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      RemedyCategory.countDocuments()
    ]);

    return res.status(200).json(
      apiResponse(200, {
        categories,
        pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      }, "Categories fetched with pagination")
    );
  } catch (error) {
    return res.status(500).json(apiResponse(500, null, error.message));
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
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json(apiResponse(400, null, "Invalid ID"));
    }

    const category = await RemedyCategory.findByIdAndUpdate(id, req.body, {
      new: true,
      session,
    });

    if (!category) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json(apiResponse(404, null, "Category not found"));
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(apiResponse(200, category, "Category updated successfully"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json(apiResponse(500, null, error.message));
  }
};


export const deleteRemedyCategory = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json(apiResponse(400, null, "Invalid ID"));
    }

    const category = await RemedyCategory.findByIdAndDelete(id, { session });
    if (!category) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json(apiResponse(404, null, "Category not found"));
    }

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(apiResponse(200, { id: category._id }, "Category deleted"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json(apiResponse(500, null, error.message));
  }
};


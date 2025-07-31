import { apiResponse } from "../../helper.js";
import ArticleCategory from "../../models/articleCategories.model.js";
import mongoose from "mongoose";
// Create
export const createArticleCategory = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const category = await ArticleCategory.create([req.body], { session });

    await session.commitTransaction();
    return res.status(201).json({ success: true, data: category[0] });
  } catch (error) {
    await session.abortTransaction();
    return res.status(400).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};



// Get all
export const getAllArticleCategories = async (req, res) => {
  try {
    const limit = req.query.limit
      ? Math.min(Math.max(parseInt(req.query.limit), 1), 100)
      : undefined;
    const page = req.query.page
      ? Math.max(parseInt(req.query.page), 1)
      : undefined;
    const skip = page && limit ? (page - 1) * limit : undefined;

    const categories = await ArticleCategory.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ArticleCategory.countDocuments();

    res.status(200).json(
      apiResponse(
        200,
        {
          categories,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
        "Article categories fetched successfully"
      )
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get one
export const getArticleCategoryById = async (req, res) => {
  try {
    const category = await ArticleCategory.findById(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update
export const updateArticleCategory = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { id } = req.params;
    const { name, description, isActive } = req.body;

    if (!id || !name) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Category ID or name is missing" });
    }

    const category = await ArticleCategory.findById(id).session(session);
    if (!category) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const existingCategory = await ArticleCategory.findOne({
      _id: { $ne: id },
      name,
    }).session(session);

    if (existingCategory) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Category name already exists" });
    }

    category.name = name;
    category.description = description;
    category.isActive = isActive;

    await category.save({ session });

    await session.commitTransaction();
    return res.json({ success: true, data: category });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// Delete
export const deleteArticleCategory = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const category = await ArticleCategory.findByIdAndDelete(req.params.id).session(session);

    if (!category) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    await session.commitTransaction();
    return res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};
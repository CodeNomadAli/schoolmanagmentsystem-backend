
import { apiResponse } from "../../helper.js";
import ArticleCategory from "../../models/articleCategories.model.js";

// Create
export const createArticleCategory = async (req, res) => {
  try {
    const category = await ArticleCategory.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all
export const getAllArticleCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const categories = await ArticleCategory.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ArticleCategory.countDocuments();

    res.status(200).json(apiResponse(200,{
        categories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }, "Article categories fetched successfully")); 
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get one
export const getArticleCategoryById = async (req, res) => {
  try {
    const category = await ArticleCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update
export const updateArticleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "Category ID is required" });
    if (!req.body.name) return res.status(400).json({ success: false, message: "Category name is required" });

    // Check if category exists
    const category = await ArticleCategory.findById(id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    // Check for duplicate category name
    const existingCategory = await ArticleCategory.findOne({ _id: { $ne: id }, name: req.body.name });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: "Category name already exists" });
    }

    // Update the category
    const updatedCategory = await ArticleCategory.findByIdAndUpdate(
      id,
      { $set: { name: req.body.name, description: req.body.description, isActive: req.body.isActive } },
      { new: true }
    );

    res.json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete
export const deleteArticleCategory = async (req, res) => {
  try {
    const category = await ArticleCategory.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

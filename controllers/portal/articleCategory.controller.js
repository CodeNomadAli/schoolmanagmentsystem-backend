
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
    const categories = await ArticleCategory.find().sort({ createdAt: -1 });
    res.json({ success: true, data: categories });
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
    const category = await ArticleCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
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

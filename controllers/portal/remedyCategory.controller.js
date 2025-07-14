
import mongoose from "mongoose";
import RemedyCategory from "../../models/remedyCategories.model.js";
import { apiResponse } from "../../helper.js";
// Create
export const createRemedyCategory = async (req, res) => {
  try {
    const { name, description, relatedQuestions } = req.body;

    // Validate: name required
    if (!name || typeof name !== 'string')
      return res.status(400).json({ success: false, message: "Name is required" });

    // Validate: relatedQuestions required and must be non-empty array
    if (
      !Array.isArray(relatedQuestions) ||
      relatedQuestions.length === 0 ||
      relatedQuestions.some(q => !q.question || typeof q.question !== 'string')
    ) {
      return res.status(400).json({
        success: false,
        message: "relatedQuestions must be a non-empty array of objects with a 'question' field"
      });
    }

    const category = await RemedyCategory.create({
      name,
      description,
      relatedQuestions,
    });

    res.status(201).json({ success: true, message: "Category created", category });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get all
export const getAllRemedyCategories = async (req, res) => {
  try {
    const categories = await RemedyCategory.find().sort({ createdAt: -1 });
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getCategoriesById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const category = await RemedyCategory.findById(id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });   

    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update
export const updateRemedyCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const category = await RemedyCategory.findByIdAndUpdate(id, req.body, { new: true });
    if (!category) return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, message: "Category updated", category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete
export const deleteRemedyCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const category = await RemedyCategory.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, message: "Category deleted", id: category._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

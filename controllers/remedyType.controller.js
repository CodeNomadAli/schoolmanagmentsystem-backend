
import mongoose from "mongoose";
import RemedyType from "../models/remedy_types.model.js";

// Create
export const createRemedyType = async (req, res) => {
  try {
    const { name, description } = req.body;
    const type = await RemedyType.create({ name, description });
    res.status(201).json({ success: true, message: "Remedy type created", type });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all
export const getAllRemedyTypes = async (req, res) => {
  try {
    const types = await RemedyType.find().sort({ createdAt: -1 });
    res.json({ success: true, types });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRemedyTypesById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const type = await RemedyType.findById(id);
    if (!type) return res.status(404).json({ success: false, message: "Type not found" });

    res.json({ success: true, type });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update
export const updateRemedyType = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const type = await RemedyType.findByIdAndUpdate(id, req.body, { new: true });
    if (!type) return res.status(404).json({ success: false, message: "Type not found" });

    res.json({ success: true, message: "Remedy type updated", type });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete
export const deleteRemedyType = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid ID" });

    const type = await RemedyType.findByIdAndDelete(id);
    if (!type) return res.status(404).json({ success: false, message: "Type not found" });

    res.json({ success: true, message: "Remedy type deleted", id: type._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

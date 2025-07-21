import Ailment from "../../models/aliments.model.js";
import { apiResponse } from "../../helper.js";
import mongoose from "mongoose";

export const createAilment = async (req, res) => {
  try {
    const { name, description, remedies } = req.body;
    const createdBy = req.user?._id; 

    const existing = await Ailment.findOne({ name: name.trim() });
    if (existing) {
      return res
        .status(409)
        .json(apiResponse(409, null, "Ailment with this name already exists"));
    }

    const ailment = await Ailment.create({
      name,
      description,
      createdBy,
      remedies,
    });

    return res.status(201).json(apiResponse(201, ailment, "Ailment created"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

export const getAllAilments = async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const searchQuery = { isActive: true };

    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const [ailments, total] = await Promise.all([
      Ailment.find(searchQuery)
        .populate("remedies")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Ailment.countDocuments(searchQuery),
    ]);

    const data = {
      ailments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };

    return res
      .status(200)
      .json(apiResponse(200, data, "Successfully fetched ailments"));
  } catch (error) {
    console.error("Error fetching ailments:", error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};


export const getAilment = async (req, res) => {
  try {
    const { id } = req.params; 
  
   const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { slug: id };
     
    const ailment = await Ailment.findOne(query)
      .populate({path: "remedies"}) 
      .exec();

    if (!ailment) {
      return res.status(404).json(apiResponse(404, null, "Ailment not found"));
    }

    return res.status(200).json(apiResponse(200, { ailment }, "Ailment found"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};


export const updateAilment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const ailment = await Ailment.findById(id);
    if (!ailment) {
      return res.status(404).json(apiResponse(404, null, "Ailment not found"));
    }

    if (updates.name && updates.name !== ailment.name) {
      ailment.name = updates.name;
    }

    if (updates.description) ailment.description = updates.description;
    if (updates.remedies) ailment.remedies = updates.remedies;
    if (updates.createdBy) ailment.createdBy = updates.createdBy;

    await ailment.save(); 
    return res.status(200).json(apiResponse(200, ailment, "Ailment updated"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

export const deleteAilment = async (req, res) => {
  try {
    const { id } = req.params;

    const ailment = await Ailment.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!ailment) {
      return res.status(404).json(apiResponse(404, null, "Ailment not found"));
    }

    return res.status(200).json(apiResponse(200, ailment, "Ailment deleted"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

export const searchOrCreateAilment = async (req, res) => {
  try {
    const { name, description = "" } = req.body;
    const createdBy = req.user ? req.user._id : null;

    if (!name || !name.trim()) {
      return res.status(400).json(apiResponse(400, null, "Name is required"));
    }

    const trimmedName = name.trim();

    let ailment = await Ailment.findOne({
      name: new RegExp(`^${trimmedName}$`, "i"),
    });

    if (!ailment) {
      ailment = await Ailment.create({
        name: trimmedName,
        description,
        createdBy,
      });
      return res.status(201).json(apiResponse(201, ailment, "Ailment created"));
    }

    return res.status(200).json(apiResponse(200, ailment, "Ailment found"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

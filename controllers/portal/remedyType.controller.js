import mongoose from "mongoose";
import RemedyType from "../../models/remedy_types.model.js";
import { apiResponse } from "../../helper.js";
import { remedyTypeSchema } from "../../validations/remedyTypeValidator.js";

export const createRemedyType = async (req, res) => {
   try {
    const { error, value } = remedyTypeSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res
        .status(400)
        .json(apiResponse(400, null, error.details.map(d => d.message).join(", ")));
    }

    const type = await RemedyType.create(value);

    return res.status(201).json(apiResponse(201, type, "Remedy type created"));
  } catch (error) {
    return res.status(500).json(apiResponse(500, null, error.message));
  }
};

export const getAllRemedyTypes = async (req, res) => {
  try {
    const types = await RemedyType.find().sort({ createdAt: -1 });

    return res.json(apiResponse(200, types));
  } catch (error) {
    return res.status(500).json(apiResponse(500, null, error.message));
  }
};


export const getRemedyTypesById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(apiResponse(400, null, "Invalid ID"));
    }

    const type = await RemedyType.findById(id);
    if (!type) {
      return res.status(404).json(apiResponse(404, null, "Remedy type not found"));
    }

    return res.json(apiResponse(200, type));
  } catch (error) {
    return res.status(500).json(apiResponse(500, null, error.message));
  }
};


export const updateRemedyType = async (req, res) => {
 try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(apiResponse(400, null, "Invalid ID"));
    }

    const { error, value } = remedyTypeSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json(apiResponse(400, null, error.details.map(d => d.message).join(", ")));
    }

    const type = await RemedyType.findByIdAndUpdate(id, value, { new: true });

    if (!type) {
      return res.status(404).json(apiResponse(404, null, "Remedy type not found"));
    }

    return res.json(apiResponse(200, type, "Remedy type updated"));
  } catch (error) {
    return res.status(500).json(apiResponse(500, null, error.message));
  }
};


export const deleteRemedyType = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(apiResponse(400, null, "Invalid ID"));
    }

    const type = await RemedyType.findByIdAndDelete(id);
    if (!type) {
      return res.status(404).json(apiResponse(404, null, "Remedy type not found"));
    }

    return res.json(apiResponse(200, { id: type._id }, "Remedy type deleted"));
  } catch (error) {
    return res.status(500).json(apiResponse(500, null, error.message));
  }
};

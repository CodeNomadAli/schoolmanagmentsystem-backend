import mongoose from "mongoose";
import RemedyType from "../../models/remedy_types.model.js";
import { apiResponse } from "../../helper.js";
import { remedyTypeSchema } from "../../validations/remedyTypeValidator.js";

export const createRemedyType = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { error, value } = remedyTypeSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json(apiResponse(400, null, error.details.map((d) => d.message).join(", ")));
    }

    const [type] = await RemedyType.create([value], { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(apiResponse(201, type, "Remedy type created"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json(apiResponse(500, null, error.message));
  }
};


export const getAllRemedyTypes = async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    const [types, total] = await Promise.all([
      RemedyType.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      RemedyType.countDocuments(),
    ]);

    return res.status(200).json(
      apiResponse(
        200,
        {
          types,
          pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
          },
        },
        "Remedy types fetched successfully"
      )
    );
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
      return res
        .status(404)
        .json(apiResponse(404, null, "Remedy type not found"));
    }

    return res.json(apiResponse(200, type));
  } catch (error) {
    return res.status(500).json(apiResponse(500, null, error.message));
  }
};

export const updateRemedyType = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json(apiResponse(400, null, "Invalid ID"));
    }

    const { error, value } = remedyTypeSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json(apiResponse(400, null, error.details.map((d) => d.message).join(", ")));
    }

    const type = await RemedyType.findByIdAndUpdate(id, value, {
      new: true,
      session,
    });

    if (!type) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json(apiResponse(404, null, "Remedy type not found"));
    }

    await session.commitTransaction();
    session.endSession();

    return res.json(apiResponse(200, type, "Remedy type updated"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json(apiResponse(500, null, error.message));
  }
};


export const deleteRemedyType = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json(apiResponse(400, null, "Invalid ID"));
    }

    const type = await RemedyType.findByIdAndDelete(id, { session });
    if (!type) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json(apiResponse(404, null, "Remedy type not found"));
    }

    await session.commitTransaction();
    session.endSession();

    return res.json(apiResponse(200, { id: type._id }, "Remedy type deleted"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json(apiResponse(500, null, error.message));
  }
};


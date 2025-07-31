import mongoose from "mongoose";
import { apiResponse } from "../helper.js";
import Plan from "../models/plan.model.js";

// ✅ Create Plan with DB Transaction
export const createPlan = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, planId, price, interval, description, features } = req.body;

    if (!name || !planId || !price) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json(apiResponse(400, null, "Name, planId, and price are required."));
    }

    const createdPlan = await Plan.create(
      [
        {
          name,
          planId,
          price,
          interval,
          description,
          features,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res
      .status(201)
      .json(apiResponse(201, createdPlan[0], "Plan created successfully."));
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json(apiResponse(500, null, "Server error", err.message));
  }
};

// ✅ Get All Plans (No Transaction Needed)
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    return res
      .status(200)
      .json(apiResponse(200, plans, "Plans fetched successfully."));
  } catch (err) {
    return res
      .status(500)
      .json(apiResponse(500, null, "Failed to fetch plans", err.message));
  }
};

// ✅ Get Plan by ID (No Transaction Needed)
export const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json(apiResponse(404, null, "Plan not found"));
    }

    return res
      .status(200)
      .json(apiResponse(200, plan, "Plan fetched successfully."));
  } catch (err) {
    return res
      .status(500)
      .json(apiResponse(500, null, "Error fetching plan", err.message));
  }
};

// ✅ Delete Plan with DB Transaction
export const deletePlan = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const deletedPlan = await Plan.findByIdAndDelete(req.params.id, {
      session,
    });

    if (!deletedPlan) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json(apiResponse(404, null, "Plan not found"));
    }

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(apiResponse(200, deletedPlan, "Plan deleted successfully."));
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json(apiResponse(500, null, "Failed to delete plan", err.message));
  }
};

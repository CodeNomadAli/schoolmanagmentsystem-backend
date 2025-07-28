import Plan from "../models/plan.model.js";

// Create a new plan
export const createPlan = async (req, res) => {
  try {
    const { name, planId, price, interval, description, features } = req.body;

    if (!name || !planId || !price) {
      return res.status(400).json({ error: "Name, planId, and price are required." });
    }

    const plan = await Plan.create({
      name,
      planId,
      price,
      interval,
      description,
      features,
    });

    return res.status(201).json({ message: "Plan created successfully.", plan });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Get all plans
export const getAllPlans = async (req, res) => {
  try {
    console.log(req.body)
    const plans = await Plan.find();
    return res.status(200).json(plans);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch plans" });
  }
};

// Get plan by ID
export const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ error: "Plan not found" });
    return res.status(200).json(plan);
  } catch (err) {
    return res.status(500).json({ error: "Error fetching plan" });
  }
};

// Delete plan
export const deletePlan = async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Plan deleted successfully." });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete plan." });
  }
};

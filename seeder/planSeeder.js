

import mongoose from "mongoose";
import dotenv from "dotenv";
import Plan from "../models/plan.model.js"; 

dotenv.config();


await mongoose.connect(process.env.MONGO_URI);
console.log("✅ MongoDB connected.");


const plans = [
  {
    name: "Pay For 10 Remedies",
    planId: "price_1Rp2ZxK9YmpjdcmXZUJnbivU",
    price: 14.99,
    interval: "one_time",
    description: "One-time access to 10 remedies.",
  },
  {
    name: "Pay For 5 Remedies",
    planId: "price_1Rp2YoK9YmpjdcmXhxPuXGxA",
    price: 7.99,
    interval: "one_time",
    description: "One-time access to 5 remedies.",
  },
  {
    name: "Annually",
    planId: "price_1Rp2UMK9YmpjdcmXr7hgZ1lf",
    price: 89.99,
    interval: "year",
    description: "Annual subscription with full access.",
  },
  {
    name: "Monthly",
    planId: "price_1Rp2OGK9YmpjdcmXYq83Zkm0",
    price: 8.99,
    interval: "month",
    description: "Monthly subscription with full access.",
  }
];

const seedPlans = async () => {
  try {
    await Plan.deleteMany(); // Clear existing plans (optional)
    const inserted = await Plan.insertMany(plans);
    console.log(`✅ Seeded ${inserted.length} plans.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedPlans();

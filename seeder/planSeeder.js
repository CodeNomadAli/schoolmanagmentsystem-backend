import mongoose from "mongoose";
import dotenv from "dotenv";
import Plan from "../models/plan.model.js";
import Remedy from "../models/remedy.model.js"; // <-- make sure this path is correct

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
console.log("✅ MongoDB connected.");

// Define plans
const plans = [
  {
    name: "Free",
    slug: "free",
    planId: "price_free_001",
    price: 0,
    interval: "one_time",
    description: "Free plan with limited remedies access.",
    subscriptionType: "subscription",
  },
  {
    name: "Annually",
    slug: "annually",
    planId: "price_1Rp2UMK9YmpjdcmXr7hgZ1lf",
    price: 89.99,
    interval: "year",
    description: "Annual subscription with full access.",
    subscriptionType: "subscription",
  },
  {
    name: "Monthly",
    slug: "monthly",
    planId: "price_1Rp2OGK9YmpjdcmXYq83Zkm0",
    price: 8.99,
    interval: "month",
    description: "Monthly subscription with full access.",
    subscriptionType: "subscription",
  },
  {
    name: "Ten Remedies",
    slug: "ten-remedies",
    planId: "price_1Rp2ZxK9YmpjdcmXZUJnbivU",
    price: 14.99,
    interval: "one_time",
    description: "One-time access to 10 remedies.",
  },
  {
    name: "Five Remedies",
    slug: "five-remedies",
    planId: "price_1Rp2YoK9YmpjdcmXhxPuXGxA",
    price: 7.99,
    interval: "one_time",
    description: "One-time access to 5 remedies.",
  },
];

const seedPlans = async () => {
  try {
    // Fetch remedies from DB
    const remedies = await Remedy.find().limit(18); // Total 3 + 5 + 10 = 18 needed

    if (remedies.length < 18) {
      throw new Error("❌ Not enough remedies in DB. At least 18 required.");
    }

    const freeRemedies = remedies.slice(0, 3).map(r => r._id.toString());
    const fiveRemedies = remedies.slice(3, 8).map(r => r._id.toString());
    const tenRemedies = remedies.slice(8, 18).map(r => r._id.toString());

    const planFeatures = {
      free: [
        {
          slug: "access-3-remedies-per-ailment",
          description: "Access 3 Remedies per Ailment",
          remedies: freeRemedies,
        },
        {
          slug: "rate-review-remedies",
          description: "Rate & Review Remedies",
          
        },
        {
          slug: "save-favorite-remedies",
          description: "Save Favorite Remedies",
          
        },
      ],
      annually: [
        { slug: "unlimited-remedy-access", description: "Unlimited Remedy Access" },
        { slug: "ai-generated-remedy-recommendations", description: "AI-Generated Remedy Recommendations" },
        { slug: "success-rate-ai-confidence", description: "Success Rate & AI Confidence Scores" },
        { slug: "priority-support", description: "Priority Support" },
        { slug: "save-favorite-remedies", description: "Save Favorite Remedies" },
        { slug: "personalized-ai-insights", description: "Personalized AI Insights" },
      ],
      monthly: [
        { slug: "unlimited-remedy-access", description: "Unlimited Remedy Access" },
        { slug: "ai-generated-remedy-recommendations", description: "AI-Generated Remedy Recommendations" },
        { slug: "success-rate-ai-confidence", description: "Success Rate & AI Confidence Scores" },
        { slug: "priority-support", description: "Priority Support" },
        { slug: "save-favorite-remedies", description: "Save Favorite Remedies" },
        { slug: "personalized-ai-insights", description: "Personalized AI Insights" },
      ],
      "five-remedies": [
        {
          slug: "select-ailment-top-remedies",
          description: "Select an ailment, and unlock access to its top remedies",
          remedies: fiveRemedies,
        },
        {
          slug: "access-5-remedies",
          description: "Access 5 remedies for your selected ailment. One-time purchase.",
          
        },
      ],
      "ten-remedies": [
        {
          slug: "select-ailment-top-remedies",
          description: "Select an ailment, and unlock access to its top remedies",
          remedies: tenRemedies,
        },
        {
          slug: "access-10-remedies",
          description: "Access 10 remedies for your selected ailment. One-time purchase.",
          
        },
      ],
    };

    await Plan.deleteMany();
    const insertedPlans = await Plan.insertMany(plans);
    console.log(`✅ Seeded ${insertedPlans.length} plans.`);

    for (const plan of insertedPlans) {
      const features = planFeatures[plan.slug] || [];
      await Plan.updateOne({ _id: plan._id }, { $set: { features } });
      console.log(`✅ Updated features for plan: ${plan.name}`);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedPlans();

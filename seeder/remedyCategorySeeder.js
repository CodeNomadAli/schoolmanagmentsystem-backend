import mongoose from "mongoose";
import RemedyCategory from "../models/categories.model.js";
import dotenv from "dotenv";

dotenv.config();

const remedyCategories = [
  {
    name: "Community Remedies",
    description: "Traditional remedies passed down through generations.",
  },
  {
    name: "Pain Relief",
    description: "Treatments for headaches, muscle pain, etc.",
  },
  {
    name: "Digestive",
    description: "Helps with digestion issues like bloating or constipation.",
  },
  {
    name: "Respiratory",
    description: "Supports breathing, colds, and sinus relief.",
  },
  {
    name: "Immune Support",
    description: "Boosts immune system and overall health.",
  },
  {
    name: "Sleep Aid",
    description: "Helps improve sleep quality.",
  },
  {
    name: "Skin Care",
    description: "Treats skin issues like acne, dryness, or rashes.",
  },
];

const seedRemedyCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await RemedyCategory.deleteMany(); // Optional: clear existing categories
    await RemedyCategory.insertMany(remedyCategories);
    console.log("✅ Remedy categories seeded");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding remedy categories:", error);
    process.exit(1);
  }
};

export default seedRemedyCategories;

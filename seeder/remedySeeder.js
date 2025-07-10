import mongoose from "mongoose";
import dotenv from "dotenv";
import RemedyType from "../models/remedy_types.model.js";
import RemedyCategory from "../models/categories.model.js";
import User from "../models/user.model.js";
import Remedy from "../models/remedy.model.js";
import hashPassword from "../utils/hashPassword.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/remedy")
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

const seedRemedyTypes = async () => {
  const types = ["pharmaceutical", "alternative", "community"];
  const created = [];

  for (const name of types) {
    const exists = await RemedyType.findOne({ name });
    if (!exists) {
      const type = await RemedyType.create({ name });
      created.push(type.name);
    }
  }

  if (created.length) {
    console.log(`✅ RemedyTypes created: ${created.join(", ")}`);
  } else {
    console.log("ℹ️ RemedyTypes already exist. Skipping.");
  }
};

const seedRemedyCategories = async () => {
  const categories = [
    "Community Remedies",
    "Pain Relief",
    "Digestive",
    "Respiratory",
    "Immune Support",
    "Sleep Aid",
    "Skin Care",
  ];
  const created = [];

  for (const name of categories) {
    const exists = await RemedyCategory.findOne({ name });
    if (!exists) {
      const cat = await RemedyCategory.create({ name });
      created.push(cat.name);
    }
  }

  if (created.length) {
    console.log(`✅ RemedyCategories created: ${created.join(", ")}`);
  } else {
    console.log("ℹ️ RemedyCategories already exist. Skipping.");
  }
};

const seedUser = async () => {
  const email = "admin@demo.com";
  const existing = await User.findOne({ email });

  if (!existing) {
    const password = await hashPassword("admin123");
    const user = await User.create({
      username: "admin",
      email,
      password,
      role: "admin",
      status: "active",
    });
    console.log(`✅ Admin user created: ${user.email}`);
    return user;
  } else {
    console.log(`ℹ️ Admin user already exists: ${existing.email}`);
    return existing;
  }
};

const seedRemedies = async (user) => {
  const communityType = await RemedyType.findOne({ name: "community" });
  const altType = await RemedyType.findOne({ name: "alternative" });
  const digestiveCat = await RemedyCategory.findOne({ name: "Digestive" });
  const sleepAidCat = await RemedyCategory.findOne({ name: "Sleep Aid" });

  if (!communityType || !altType || !digestiveCat || !sleepAidCat) {
    console.error("❌ Required RemedyType or RemedyCategory not found.");
    return;
  }

  await Remedy.deleteMany(); // Clear previous remedies

  const remedies = [
    {
      name: "Ginger Tea",
      description: "Helps with digestion and relieves nausea.",
      category: digestiveCat._id,
      type: communityType._id,
      createdBy: user._id,
      ingredients: "Fresh ginger, water, lemon",
      preparationMethod: "Boil ginger in water, add lemon.",
      instructions: "Drink after meals.",
      aiConfidenceScore: 90,
      isAIGenerated: true,
      averageRating: 4.5,
    },
    {
      name: "Turmeric Milk",
      description: "Used for inflammation and sleep support.",
      category: sleepAidCat._id,
      type: altType._id,
      createdBy: user._id,
      ingredients: "Milk, turmeric, black pepper",
      preparationMethod: "Warm milk, add turmeric and pepper.",
      instructions: "Drink before bed.",
      aiConfidenceScore: 88,
      isAIGenerated: false,
      averageRating: 4.2,
    },
  ];

  const inserted = await Remedy.insertMany(remedies);
  console.log(`✅ Inserted ${inserted.length} remedies.`);
};

const runSeeder = async () => {
  await connectDB();
  await seedRemedyTypes();
  await seedRemedyCategories();
  const user = await seedUser();
  await seedRemedies(user);
  console.log("🌱 Seeding complete.");
  process.exit(0);
};

export default runSeeder;

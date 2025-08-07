import mongoose from "mongoose";
import dotenv from "dotenv";
import Remedy from "../models/remedy.model.js";
import slugify from "../utils/slugify.js";
import { v4 as uuid } from "uuid"; // ✅ correct import
dotenv.config();

// Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/remedy"
    );
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

const updateRemedySlugs = async () => {
  try {
    const remedies = await Remedy.find({}, "_id name");
    console.log(`🔍 Found ${remedies.length} remedies`);

    for (const remedy of remedies) {
      const newSlug = slugify(`${remedy.name}-${uuid()}`, {
        lower: true,
        strict: true,
      });
      await Remedy.findByIdAndUpdate(remedy._id, { slug: newSlug });
      console.log(`✅ Updated slug for: ${remedy.name} -> ${newSlug}`);
    }

    console.log("🎉 Slug update complete");
  } catch (error) {
    console.error("❌ Error updating slugs:", error);
  }
};

const runSeeder = async () => {
  await connectDB();
  await updateRemedySlugs();
  mongoose.disconnect();
};

runSeeder();

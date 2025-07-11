import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import seedPermissions from "./staffPermissionSeeder.js";
import seedRoles from "./roleSeeder.js";
import adminSeeder from "./adminSeeder.js";
import seedRemedyCategories from "./remedyCategorySeeder.js";
import seedRemedyTypes from "./remedyTypeSeeder.js";
import seedRemedies from "./remedySeeder.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/remedy";

const runAllSeeders = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await seedPermissions();
    await seedRoles();
    await adminSeeder();
    await seedRemedyCategories();
    await seedRemedyTypes();
    await seedRemedies();

    console.log("🎉 All seeders ran successfully");
  } catch (err) {
    console.error("❌ Seeder error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
};

runAllSeeders();

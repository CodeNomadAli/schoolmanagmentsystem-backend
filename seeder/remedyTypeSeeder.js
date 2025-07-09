import mongoose from "mongoose";
import RemedyType from "../models/remedy_types.model.js";
import dotenv from "dotenv";

dotenv.config();

const remedyTypes = [
  {
    name: "pharmaceutical",
    description: "Doctor-prescribed or over-the-counter chemical-based remedies.",
  },
  {
    name: "alternative",
    description: "Non-conventional treatments like herbal or holistic remedies.",
  },
  {
    name: "community",
    description: "Traditionally passed-down community/home remedies.",
  },
];

const seedRemedyTypes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await RemedyType.deleteMany(); // Optional: clear existing types
    await RemedyType.insertMany(remedyTypes);
    console.log("✅ Remedy types seeded");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding remedy types:", error);
    process.exit(1);
  }
};

export default seedRemedyTypes;

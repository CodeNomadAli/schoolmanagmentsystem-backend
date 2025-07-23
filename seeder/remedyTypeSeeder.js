import mongoose from "mongoose";
import RemedyType from "../models/remedy_types.model.js";
import dotenv from "dotenv";

dotenv.config();

const remedyTypes = [
  {
    name: "Pharmaceutical",
    description: "Doctor-prescribed or over-the-counter chemical-based remedies.",
  },
  {
    name: "Alternative",
    description: "Non-conventional treatments like herbal or holistic remedies.",
  },
  {
    name: "Community",
    description: "Traditionally passed-down community/home remedies.",
  },
];

const seedRemedyTypes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    let createdCount = 0;
    let skippedCount = 0;

    for (const remedyType of remedyTypes) {
      const existing = await RemedyType.findOne({ name: remedyType.name });
      if (existing) {
        console.log(`⏭️ Skipped existing remedy type: ${remedyType.name}`);
        skippedCount++;
        continue;
      }

      await RemedyType.create(remedyType);
      console.log(`✅ Inserted remedy type: ${remedyType.name}`);
      createdCount++;
    }

    console.log(`🌱 Remedy types seeding complete: ${createdCount} inserted, ${skippedCount} skipped`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding remedy types:", error);
    process.exit(1);
  }
};


export default seedRemedyTypes();

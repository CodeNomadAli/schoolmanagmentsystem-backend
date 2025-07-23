import mongoose from "mongoose";
import RemedyCategory from "../models/remedy_categories.model.js";
import dotenv from "dotenv";
dotenv.config();
const remedyCategories = [
  {
    name: "Community Remedies",
    description: "Remedies from traditional or alternative health systems.",
    relatedQuestions: [
      {
        question: "Describe the traditional or cultural background of this remedy.",
        is_required: true,
        input_type: "textarea"
      }
    ]
  },
  {
    name: "Alternative Remedies",
    description: "Remedies from traditional or alternative health systems.",
    relatedQuestions: [
      {
        question: "Select the primary traditional or alternative health system this remedy originates from.",
        is_required: true,
        input_type: "select",
        multiple: true,
        options: [
          { value: "ayurveda", label: "Ayurveda" },
          { value: "tcm", label: "Traditional Chinese Medicine (TCM)" },
          { value: "herbalism", label: "Herbalism" },
          { value: "homeopathy", label: "Homeopathy" },
          { value: "folk_tradition", label: "Folk Tradition" },
          { value: "other", label: "Other" }
        ]
      }
    ]
  },
  {
    name: "Lifestyle Remedies",
    description: "Remedies to support various aspects of lifestyle.",
    relatedQuestions: [
      {
        question: "Select one or more areas of lifestyle this remedy primarily addresses.",
        is_required: true,
        input_type: "checkbox",
        multiple: true,
        options: [
          { value: "sleep", label: "Sleep" },
          { value: "stress_management", label: "Stress Management" },
          { value: "energy", label: "Energy" },
          { value: "focus", label: "Focus" },
          { value: "mood", label: "Mood" },
          { value: "productivity", label: "Productivity" },
          { value: "hydration", label: "Hydration" },
          { value: "mindfulness", label: "Mindfulness" },
          { value: "habit_formation", label: "Habit Formation" },
          { value: "personal_growth", label: "Personal Growth" },
          { value: "physical_activity", label: "Physical Activity" },
          { value: "nutrition", label: "Nutrition (General Wellness)" }
        ]
      }
    ]
  },
  {
    name: "Home & Comfort Remedies",
    description: "Remedies for home maintenance or personal comfort.",
    relatedQuestions: [
      {
        question: "Select one or more areas of your home or comfort this remedy benefits.",
        is_required: true,
        input_type: "checkbox",
        multiple: true,
        options: [
          { value: "cleaning", label: "Cleaning" },
          { value: "air_quality", label: "Air Quality" },
          { value: "organization", label: "Organization" },
          { value: "relaxation", label: "Relaxation" },
          { value: "pet_care", label: "Pet Care" },
          { value: "gardening", label: "Gardening" },
          { value: "diy_projects", label: "DIY Projects" },
          { value: "ambiance", label: "Ambiance" },
          { value: "personal_comfort", label: "Personal Comfort" }
        ]
      }
    ]
  }
];
const seedRemedyCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    for (const category of remedyCategories) {
      const existingCategory = await RemedyCategory.findOne({ name: category.name });
      if (existingCategory) {
        console.log(`Skipping existing category: ${category.name}`);
        continue;
      }
      await RemedyCategory.create(category);
      console.log(`Inserted category: ${category.name}`);
    }
    
    process.exit();
  } catch (error) {
    console.error(":x: Error seeding remedy categories:", error);
    process.exit(1);
  }
};
seedRemedyCategories();
  
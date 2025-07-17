import mongoose from "mongoose";
import RemedyCategory from "../models/remedy_categories.model.js";
import dotenv from "dotenv";
import { multipleOf } from "zod/v4";

dotenv.config();

const remedyCategories = [
  {
    name: "Community Remedies",
    description: "Traditional remedies passed down through generations.",
    relatedQuestions: [
      {
        question: "What remedy did your elders use for this condition?",
        is_required: true,
        input_type: "textarea"
      },
      {
        question: "Do you still use this remedy today?",
        is_required: true,
        input_type: "radio",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      }
    ]
  },
  {
    name: "Pain Relief",
    description: "Treatments for headaches, muscle pain, etc.",
    relatedQuestions: [
      {
        question: "Where is the pain located?",
        is_required: true,
        input_type: "text"
      },
      {
        question: "Rate your pain level",
        is_required: true,
        input_type: "select",
        multiple:true,
        options: [
          { value: "1", label: "Mild" },
          { value: "2", label: "Moderate" },
          { value: "3", label: "Severe" }
        ]
      }
    ]
  },
  {
    name: "Digestive",
    description: "Helps with digestion issues like bloating or constipation.",
    relatedQuestions: [
      {
        question: "Do you experience bloating after meals?",
        is_required: true,
        input_type: "radio",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      },
      {
        question: "Which symptoms apply to you?",
        is_required: false,
        input_type: "checkbox",
        options: [
          { value: "bloating", label: "Bloating" },
          { value: "gas", label: "Gas" },
          { value: "constipation", label: "Constipation" }
        ]
      }
    ]
  },
  {
    name: "Respiratory",
    description: "Supports breathing, colds, and sinus relief.",
    relatedQuestions: [
      {
        question: "How often do you experience breathing difficulty?",
        is_required: false,
        input_type: "text"
      },
      {
        question: "Describe any recent respiratory issues.",
        is_required: false,
        input_type: "textarea"
      }
    ]
  },
  {
    name: "Immune Support",
    description: "Boosts immune system and overall health.",
    relatedQuestions: [
      {
        question: "Do you take supplements regularly?",
        is_required: true,
        input_type: "radio",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      },
      {
        question: "Select the supplements you take:",
        is_required: false,
        input_type: "checkbox",
        options: [
          { value: "vitamin_c", label: "Vitamin C" },
          { value: "zinc", label: "Zinc" },
          { value: "elderberry", label: "Elderberry" }
        ]
      }
    ]
  },
  {
    name: "Sleep Aid",
    description: "Helps improve sleep quality.",
    relatedQuestions: [
      {
        question: "How many hours do you sleep daily?",
        is_required: true,
        input_type: "text"
      },
      {
        question: "Do you use any of these natural sleep aids?",
        is_required: false,
        input_type: "checkbox",
        options: [
          { value: "melatonin", label: "Melatonin" },
          { value: "chamomile", label: "Chamomile" },
          { value: "valerian_root", label: "Valerian Root" }
        ]
      }
    ]
  },
  {
    name: "Skin Care",
    description: "Treats skin issues like acne, dryness, or rashes.",
    relatedQuestions: [
      {
        question: "Do you have sensitive skin?",
        is_required: true,
        input_type: "radio",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ]
      },
      {
        question: "Select any skin issues you experience:",
        is_required: false,
        input_type: "checkbox",
        options: [
          { value: "acne", label: "Acne" },
          { value: "dryness", label: "Dryness" },
          { value: "rash", label: "Rash" }
        ]
      }
    ]
  }
];

const seedRemedyCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await RemedyCategory.deleteMany();
    await RemedyCategory.insertMany(remedyCategories);
    console.log("✅ Remedy categories and questions seeded");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding remedy categories:", error);
    process.exit(1);
  }
};

seedRemedyCategories();

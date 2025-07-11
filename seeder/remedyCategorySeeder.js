import RemedyCategory from "../models/categories.model.js";

const categories = [
  { name: "Community Remedies", description: "Traditional remedies passed down through generations." },
  { name: "Pain Relief", description: "Treatments for headaches, muscle pain, etc." },
  { name: "Digestive", description: "Helps with digestion issues like bloating or constipation." },
  { name: "Respiratory", description: "Supports breathing, colds, and sinus relief." },
  { name: "Immune Support", description: "Boosts immune system and overall health." },
  { name: "Sleep Aid", description: "Helps improve sleep quality." },
  { name: "Skin Care", description: "Treats skin issues like acne, dryness, or rashes." },
];

const seedRemedyCategories = async () => {
  await RemedyCategory.deleteMany();
  await RemedyCategory.insertMany(categories);
  console.log("✅ Remedy categories seeded");
};

export default seedRemedyCategories;

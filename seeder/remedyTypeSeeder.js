import RemedyType from "../models/remedy_types.model.js";

const types = [
  { name: "pharmaceutical", description: "Doctor-prescribed or OTC chemical-based remedies." },
  { name: "alternative", description: "Herbal, holistic or natural remedies." },
  { name: "community", description: "Traditionally passed-down home remedies." },
];

const seedRemedyTypes = async () => {
  await RemedyType.deleteMany();
  await RemedyType.insertMany(types);
  console.log("✅ Remedy types seeded");
};

export default seedRemedyTypes;

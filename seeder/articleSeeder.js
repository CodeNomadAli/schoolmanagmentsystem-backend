import mongoose from "mongoose";
import dotenv from "dotenv";
import Article from "../models/article.model.js";
import articleValidationSchema from "../validations/article.validation.js";


dotenv.config();

const articlesToSeed = [
    {
        title: "Understanding Async/Await in JavaScript",
        content: "Async/await is a powerful syntax...",
        shortDescription: "Learn how async/await works in JS.",
        slug: "understanding-async-await",
        author: "60f7c0a345d2b942d4a7f713",

        category: "64a72b2bcd7d1e3a12345678",

        tags: ["javascript", "async", "programming"],
        status: "published",
    },
    {
        title: "Node.js Streams: A Complete Guide",
        content: "Streams are one of the most powerful...",
        shortDescription: "Master Node.js streams.",
        slug: "nodejs-streams-guide",
        author: "60f7c0a345d2b942d4a7f712",
        category: "64a72b2bcd7d1e3a12345678",

        tags: ["nodejs", "streams", "backend"],
        status: "draft",
    },

];

const seedArticles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    let successCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const articleData of articlesToSeed) {
      const { error, value } = articleValidationSchema.validate(articleData);
      if (error) {
        console.error("❌ Validation failed for:", articleData.title);
        console.error("Errors:", error.details.map(e => e.message));
        errorCount++;
        continue;
      }

      
      const existingArticle = await Article.findOne({ title: value.title });
      if (existingArticle) {
        console.log(`⏭️ Skipped existing article: ${value.title}`);
        skippedCount++;
        continue;
      }

      await Article.create(value);
      console.log(`✅ Inserted: ${value.title}`);
      successCount++;
    }

    console.log(`\n🌱 Seeding complete: ${successCount} inserted, ${skippedCount} skipped, ${errorCount} failed\n`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
    process.exit(1);
  }
};


seedArticles();

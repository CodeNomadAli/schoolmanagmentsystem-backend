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

        category: "JavaScript",
        tags: ["javascript", "async", "programming"],
        status: "published",
    },
    {
        title: "Node.js Streams: A Complete Guide",
        content: "Streams are one of the most powerful...",
        shortDescription: "Master Node.js streams.",
        slug: "nodejs-streams-guide",
        author: "60f7c0a345d2b942d4a7f712",
        category: "Node.js",
        tags: ["nodejs", "streams", "backend"],
        status: "draft",
    },

];

const seedArticles = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");

        let successCount = 0;
        let errorCount = 0;

        for (const articleData of articlesToSeed) {
            const { error, value } = articleValidationSchema.validate(articleData);
            if (error) {
                console.error("❌ Validation failed for:", articleData.title);
                console.error("Errors:", error.details.map(e => e.message));
                errorCount++;
                continue;
            }

            await Article.create(value);
            console.log(`✅ Inserted: ${value.title}`);
            successCount++;
        }

        console.log(`\n🌱 Seeding complete: ${successCount} inserted, ${errorCount} failed\n`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding error:", err.message);
        process.exit(1);
    }
};

seedArticles();

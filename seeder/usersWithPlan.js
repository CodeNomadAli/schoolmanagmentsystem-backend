import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const dummyUsers = [
  {
    username: "freeuser1",
    email: "freeuser1@example.com",
    password: "password123",
    accessLevel: "freeuser",
  },
  {
    username: "prouser1",
    email: "prouser1@example.com",
    password: "password123",
    accessLevel: "prouser",
  },
  {
    username: "adminuser",
    email: "admin@example.com",
    password: "adminpass",
    accessLevel: "admin",
  },
];

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/remedy");

    
    await User.deleteMany({});

    for (const userData of dummyUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await User.create({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        accessLevel: userData.accessLevel,
      });
      console.log(`Created user: ${userData.email}`);
    }

    console.log("✅ Dummy users seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
}

seedUsers();

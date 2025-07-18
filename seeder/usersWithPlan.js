// server/seeders/freeUserSeeder.js

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import FreeUser from "../models/user-client/freeUser.model.js";

// Sample dummy users
const freeUsersData = [
  {
    username: "freeuser1",
    email: "free1@example.com",
    password: "123456",
  },
  {
    username: "freeuser2",
    email: "free2@example.com",
    password: "123456",
  },
];

export const seedFreeUsers = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/remedy");

    for (const userData of freeUsersData) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

    
      const user = new User({
        ...userData,
        password: hashedPassword,
        accessLevel: "freeuser",
        emailVerified: true,
        isActive: true,
      });

      await user.save();

      // 2. Create FreeUser linked to this User
      const freeUser = new FreeUser({
        auth: user._id,
        geographicRegion: "global",
        remedyViewCount: 0,
      });

      await freeUser.save();
    }

    console.log("✅ Free users seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding free users:", error);
    process.exit(1);
  }
};

seedFreeUsers()
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()


import seedRoles from "./roleSeeder.js"
import adminSeeder from "./adminSeeder.js"
import seedRemedyCategories from "./remedyCategorySeeder.js"
import seedRemedyTypes from "./remedyTypeSeeder.js"
import seedRemedies from "./remedySeeder.js"
async function runAllSeeders() {
  try {
    
    console.log("🟢 Connected to DB")

    await seedRoles()
    console.log("🟢 Roles seeded successfully")


    
    await seedRoles()

    await adminSeeder()
    console.log("🟢 Admin seeder ran successfully")
    await seedRemedyCategories()
    console.log("🟢 Remedy categories seeded successfully")
    await seedRemedyTypes()
    console.log("🟢 Remedy types seeded successfully")
    await seedRemedies()
    console.log("🟢 Remedies seeded successfully")

    console.log("🎉 All seeders ran successfully")
  } catch (err) {
    console.error("❌ Seeder failed:", err)
  } finally {
    await mongoose.disconnect()
    console.log("🔌 Disconnected from DB")
    process.exit(0)
  }
}

runAllSeeders()

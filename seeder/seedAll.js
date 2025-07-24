import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()


import seedRoles from "./roleSeeder.js"
import adminSeeder from "./adminSeeder.js"

import permissionSeeder from "./staffPermissionSeeder.js"
async function runAllSeeders() {
  try {
    console.log("🟢 Connected to DB")
    await permissionSeeder()
    console.log("🟢 permission seeded successfully")
    await seedRoles()
    console.log("🟢 Roles seeded successfully")
    await adminSeeder()
    console.log("🟢 Admin seeder ran successfully")
    


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

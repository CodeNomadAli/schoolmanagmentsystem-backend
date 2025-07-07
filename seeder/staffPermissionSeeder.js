import mongoose from "mongoose"
import staffPermission from "../models/staff_permission.model.js"
import staffRole from "../models/staff_role.model.js"
import staff from "../models/staff.model.js"
import { hashPassword } from "../utils/hashPassword.js" // Update the path as per your project

const permissions = [
  // User CRUD
  { name: "Create Users", slug: "create-users", description: "Can create user data" },
  { name: "Read Users", slug: "read-users", description: "Can read user data" },
  { name: "Update Users", slug: "update-users", description: "Can update user data" },
  { name: "Delete Users", slug: "delete-users", description: "Can delete user data" },

  // Staff CRUD
  { name: "Create Staff", slug: "create-staff", description: "Can create staff data" },
  { name: "Read Staff", slug: "read-staff", description: "Can read staff data" },
  { name: "Update Staff", slug: "update-staff", description: "Can update staff data" },
  { name: "Delete Staff", slug: "delete-staff", description: "Can delete staff data" },

  // Role CRUD
  { name: "Create Role", slug: "create-role", description: "Can create role data" },
  { name: "Read Role", slug: "read-role", description: "Can read role data" },
  { name: "Update Role", slug: "update-role", description: "Can update role data" },
  { name: "Delete Role", slug: "delete-role", description: "Can delete role data" },

  // Customer CRUD
  { name: "Create Customer", slug: "create-customer", description: "Can create customer data" },
  { name: "Read Customer", slug: "read-customer", description: "Can read customer data" },
  { name: "Update Customer", slug: "update-customer", description: "Can update customer data" },
  { name: "Delete Customer", slug: "delete-customer", description: "Can delete customer data" },

  // Admin-level permissions
  { name: "Manage Settings", slug: "can-manage-settings", description: "Can manage system settings" },
  { name: "View Reports", slug: "can-view-reports", description: "Can view reports and analytics" },
  { name: "Access All Data", slug: "can-access-all-data", description: "Can access all system data" }
]

async function seedEverything() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/remedy")

    // Clear and seed permissions
    await staffPermission.deleteMany({})
    await staffPermission.insertMany(permissions)

    // Delete existing Super Admin role if it exists
    const existingRole = await staffRole.findOne({ slug: "super-admin" })
    if (existingRole) {
      await staffRole.deleteOne({ _id: existingRole._id })
      console.log("🔁 Old Super Admin role deleted.")
    }

    // Create new Super Admin role
    const adminRole = await staffRole.create({
      name: "Super Admin",
      slug: "super-admin",
      description: "Full access to all system features"
    })

    // Delete existing Super Admin user if it exists
    const existingUser = await staff.findOne({ email: "superadmin@gmail.com" })
    if (existingUser) {
      await staff.deleteOne({ _id: existingUser._id })
      console.log("🔁 Old Super Admin user deleted.")
    }

    // Create new Super Admin user
    const superAdmin = await staff.create({
      firstName: "Super",
      lastName: "Admin",
      email: "superadmin@gmail.com",
      password: await hashPassword("admin123"),
      staffRoleId: adminRole._id,
      permissions: {
        canManageUsers: true,
        canManageStaff: true,
        canManageRoles: true,
        canManageSettings: true,
        canViewReports: true,
        canAccessAllData: true
      }
    })

    console.log("✅ Permissions, Super Admin role, and user seeded successfully.")
    process.exit(0)
  } catch (error) {
    console.error("❌ Seeding error:", error)
    process.exit(1)
  }
}

seedEverything()

import mongoose from "mongoose"
import StaffPermission from "../models/staff_permission.model.js"

const permissions = [
  // User CRUD
  { name: "Create Users", slug: "create-user", description: "Can create user data" },
  { name: "Read Users", slug: "read-user", description: "Can read user data" },
  { name: "Update Users", slug: "update-user", description: "Can update user data" },
  { name: "Delete Users", slug: "delete-user", description: "Can delete user data" },

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

  // Remedy CRUD
  { name: "Create Remedy", slug: "create-remedy", description: "Can create remedy data" },
  { name: "Read Remedy", slug: "read-remedy", description: "Can read remedy data" },
  { name: "Update Remedy", slug: "update-remedy", description: "Can update remedy data" },
  { name: "Delete Remedy", slug: "delete-remedy", description: "Can delete remedy data" },

  // Category CRUD
  { name: "Create Category", slug: "create-category", description: "Can create category data" },
  { name: "Read Category", slug: "read-category", description: "Can read category data" },
  { name: "Update Category", slug: "update-category", description: "Can update category data" },
  { name: "Delete Category", slug: "delete-category", description: "Can delete category data" },

  // writer Article
  { name: "Create Article", slug: "create-article", description: "Can create article data" },
  { name: "Read Article", slug: "read-article", description: "Can read article data" },
  { name: "Update Article", slug: "update-article", description: "Can update article data" },
  { name: "Delete Article", slug: "delete-article", description: "Can delete article data" },
  {
    name: "Check Article Slug",
    slug: "check-slug",
    description: "Can check if an article slug is unique"
  },
  {
    name: "Generate Article Slug",
    slug: "generate-slug",
    description: "Can auto-generate a unique article slug"
  }


]


// Define the connectToDatabase function (or import it if defined elsewhere)
async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/remedy', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}


const seedPermissions = async () => {
  try {
    await connectToDatabase()

    // Clear existing permissions
    await StaffPermission.deleteMany({})

    // Insert new permissions
    const createdPermissions = await StaffPermission.insertMany(permissions)
    console.log("✅ Permissions seeded successfully:", createdPermissions.length)
  } catch (error) {
    console.error("❌ Error seeding permissions:", error)
  } finally {
    await mongoose.disconnect()
  }
}

export default seedPermissions

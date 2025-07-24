// File: seeders/role-seeder.js
import mongoose from "mongoose";
import StaffRole from "../models/staff_role.model.js";
import staffPermission from "../models/staff_permission.model.js";

// Define the connectToDatabase function (or import it if defined elsewhere)
async function connectToDatabase() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/remedy", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

async function seedRole() {
  await connectToDatabase();

  // Optional: Clear existing data
  await StaffRole.deleteMany({});
  console.log("Cleared existing roles");

  // Define seed data
  const roles = [
    {
      name: "Super Admin",
      description: "Administrator role with full access",
      permissions: [
        await staffPermission.findOne({ slug: "create-user" }),
        await staffPermission.findOne({ slug: "read-user" }),
        await staffPermission.findOne({ slug: "update-user" }),
        await staffPermission.findOne({ slug: "delete-user" }),

        // Staff
        await staffPermission.findOne({ slug: "create-staff" }),
        await staffPermission.findOne({ slug: "read-staff" }),
        await staffPermission.findOne({ slug: "update-staff" }),
        await staffPermission.findOne({ slug: "delete-staff" }),

        // Role
        await staffPermission.findOne({ slug: "create-role" }),
        await staffPermission.findOne({ slug: "read-role" }),
        await staffPermission.findOne({ slug: "update-role" }),
        await staffPermission.findOne({ slug: "delete-role" }),

        // Remedy
        await staffPermission.findOne({ slug: "create-remedy" }),
        await staffPermission.findOne({ slug: "read-remedy" }),
        await staffPermission.findOne({ slug: "update-remedy" }),
        await staffPermission.findOne({ slug: "delete-remedy" }),
        
        await staffPermission.findOne({ slug: "create-category" }),
        await staffPermission.findOne({ slug: "read-category" }),
        await staffPermission.findOne({ slug: "update-category" }),
        await staffPermission.findOne({ slug: "delete-category" }),
        
        await staffPermission.findOne({ slug: "create-article"}),
        await staffPermission.findOne({ slug: "read-article"}),
        await staffPermission.findOne({ slug: "update-article"}),
        await staffPermission.findOne({ slug: "delete-article"}),

        await staffPermission.findOne({ slug: "create-ailment"}),
        await staffPermission.findOne({ slug: "read-ailment"}),
        await staffPermission.findOne({ slug: "update-ailment"}),
        await staffPermission.findOne({ slug: "delete-ailment"}),
        await staffPermission.findOne({ slug: "create-web-policy"}),
        await staffPermission.findOne({ slug: "read-web-policy"}),
        await staffPermission.findOne({ slug: "update-web-policy"}),
        await staffPermission.findOne({ slug: "delete-web-policy"}),

        await staffPermission.findOne({ slug: "read-article-category" }),
        await staffPermission.findOne({ slug: "create-article-category" }),
        await staffPermission.findOne({ slug: "update-article-category" }),
        await staffPermission.findOne({ slug: "delete-article-category" }),
        await staffPermission.findOne({ slug: "approve-remedy" }),
      
      ],
    },
    {
      name: "Writer",
      description: "Writer role with limited article access",
      permissions: [
        await staffPermission.findOne({ slug: "create-article" }),
        await staffPermission.findOne({ slug: "read-article" }),
        await staffPermission.findOne({ slug: "update-article" }),
        await staffPermission.findOne({ slug: "generate-slug" }),
        await staffPermission.findOne({ slug: "check-slug" }),
      ],
    },

    { name: "User", description: "Manager role with limited access" },
  ];

  // Create and save the roles
  try {
    await StaffRole.insertMany(roles);
    console.log("Roles seeded successfully");
  } catch (error) {
    console.error("Error seeding roles:", error);
  }

  // Close the database connection
  await mongoose.connection.close();
  console.log("Database connection closed");
}

export default seedRole;
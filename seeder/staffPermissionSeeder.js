import mongoose from "mongoose";
import staffPermission from "../models/staff_permission.model.js";

const permissions = [
    { name: "Create Users", slug: "create-users", description: "Can create user data" },
    { name: "Read Users", slug: "read-users", description: "Can read user data" },
    { name: "Update Users", slug: "update-users", description: "Can update user data" },
    { name: "Delete Users", slug: "delete-users", description: "Can delete user data" },

    { name: "Read Staff", slug: "read-staff", description: "Can read staff data" },
    { name: "Create Staff", slug: "create-staff", description: "Can create staff data" },
    { name: "Update Staff", slug: "update-staff", description: "Can update staff data" },
    { name: "Delete Staff", slug: "delete-staff", description: "Can delete staff data" },

    { name: "Read Role", slug: "read-role", description: "Can read role data" },
    { name: "Create Role", slug: "create-role", description: "Can create role data" },
    { name: "Update Role", slug: "update-role", description: "Can update role data" },
    { name: "Delete Role", slug: "delete-role", description: "Can delete role data" },
];

async function seedPermissions() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/remedy");
        
        await staffPermission.deleteMany({});
        await staffPermission.insertMany(permissions);

        console.log("✅ Staff Permissions seeded successfully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding permissions:", error);
        process.exit(1);
    }
}

seedPermissions();

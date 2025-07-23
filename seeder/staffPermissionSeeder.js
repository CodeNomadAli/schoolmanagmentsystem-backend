import mongoose from "mongoose";
import StaffPermission from "../models/staff_permission.model.js";
import { v4 as uuidv4 } from "uuid";

// Define group IDs (using UUIDs for uniqueness)
const groupIds = {
  user: uuidv4(),
  staff: uuidv4(),
  role: uuidv4(),
  customer: uuidv4(),
  remedy: uuidv4(),
  category: uuidv4(),
  article: uuidv4(),
  articleCategory: uuidv4(),
  ailment: uuidv4(),

};

const permissions = [
  // User CRUD
  { name: "Create Users", slug: "create-user", description: "Can create user data", groupId: groupIds.user, groupName: "User" },
  { name: "Read Users", slug: "read-user", description: "Can read user data", groupId: groupIds.user, groupName: "User" },
  { name: "Update Users", slug: "update-user", description: "Can update user data", groupId: groupIds.user, groupName: "User" },
  { name: "Delete Users", slug: "delete-user", description: "Can delete user data", groupId: groupIds.user, groupName: "User" },

  // Staff CRUD
  { name: "Create Staff", slug: "create-staff", description: "Can create staff data", groupId: groupIds.staff, groupName: "Staff" },
  { name: "Read Staff", slug: "read-staff", description: "Can read staff data", groupId: groupIds.staff, groupName: "Staff" },
  { name: "Update Staff", slug: "update-staff", description: "Can update staff data", groupId: groupIds.staff, groupName: "Staff" },
  { name: "Delete Staff", slug: "delete-staff", description: "Can delete staff data", groupId: groupIds.staff, groupName: "Staff" },

  // Role CRUD
  { name: "Create Role", slug: "create-role", description: "Can create role data", groupId: groupIds.role, groupName: "Role" },
  { name: "Read Role", slug: "read-role", description: "Can read role data", groupId: groupIds.role, groupName: "Role" },
  { name: "Update Role", slug: "update-role", description: "Can update role data", groupId: groupIds.role, groupName: "Role" },
  { name: "Delete Role", slug: "delete-role", description: "Can delete role data", groupId: groupIds.role, groupName: "Role" },


  // Remedy CRUD
  { name: "Create Remedy", slug: "create-remedy", description: "Can create remedy data", groupId: groupIds.remedy, groupName: "Remedy" },
  { name: "Read Remedy", slug: "read-remedy", description: "Can read remedy data", groupId: groupIds.remedy, groupName: "Remedy" },
  { name: "Update Remedy", slug: "update-remedy", description: "Can update remedy data", groupId: groupIds.remedy, groupName: "Remedy" },
  { name: "Delete Remedy", slug: "delete-remedy", description: "Can delete remedy data", groupId: groupIds.remedy, groupName: "Remedy" },

  // Category CRUD
  { name: "Create Category", slug: "create-category", description: "Can create category data", groupId: groupIds.category, groupName: "Category" },
  { name: "Read Category", slug: "read-category", description: "Can read category data", groupId: groupIds.category, groupName: "Category" },
  { name: "Update Category", slug: "update-category", description: "Can update category data", groupId: groupIds.category, groupName: "Category" },
  { name: "Delete Category", slug: "delete-category", description: "Can delete category data", groupId: groupIds.category, groupName: "Category" },

  // Writer Article
  { name: "Create Article", slug: "create-article", description: "Can create article data", groupId: groupIds.article, groupName: "Article" },
  { name: "Read Article", slug: "read-article", description: "Can read article data", groupId: groupIds.article, groupName: "Article" },
  { name: "Update Article", slug: "update-article", description: "Can update article data", groupId: groupIds.article, groupName: "Article" },
  { name: "Delete Article", slug: "delete-article", description: "Can delete article data", groupId: groupIds.article, groupName: "Article" },
  
  { name: "Read Article Category", slug: "read-article-category", description: "Can read article category data", groupId: groupIds.articleCategory, groupName: "Article Category" },
  { name: "Create Article Category", slug: "create-article-category", description: "Can create article category data", groupId: groupIds.articleCategory, groupName: "Article Category" },
  { name: "Update Article Category", slug: "update-article-category", description: "Can update article category data", groupId: groupIds.articleCategory, groupName: "Article Category" },
  { name: "Delete Article Category", slug: "delete-article-category", description: "Can delete article category data", groupId: groupIds.articleCategory, groupName: "Article Category" },

  //ailment 
  { name: "Read Ailment", slug: "read-ailment", description: "Can read ailment data", groupId: groupIds.ailment, groupName: "Ailment" },
  { name: "Create Ailment", slug: "create-ailment", description: "Can create ailment data", groupId: groupIds.ailment, groupName: "Ailment" },
  { name: "Update Ailment", slug: "update-ailment", description: "Can update ailment data", groupId: groupIds.ailment, groupName: "Ailment" },
  { name: "Delete Ailment", slug: "delete-ailment", description: "Can delete ailment data", groupId: groupIds.ailment, groupName: "Ailment" },
 
  
  // Privacy Policy
  { name: "Read web Policy", slug: "read-web-policy", description: "Can read web policy data", groupId: groupIds.ailment, groupName: "Web Policy" },
  { name: "Create web Policy", slug: "create-web-policy", description: "Can create web policy data", groupId: groupIds.ailment, groupName: "Web Policy" },
  { name: "Update web Policy", slug: "update-web-policy", description: "Can update web policy data", groupId: groupIds.ailment, groupName: "Web Policy" },
  { name: "Delete web Policy", slug: "delete-web-policy", description: "Can delete web policy data", groupId: groupIds.ailment, groupName: "Web Policy" },

];

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
    await connectToDatabase();

    let createdCount = 0;
    let skippedCount = 0;

    for (const permission of permissions) {
      const existingPermission = await StaffPermission.findOne({ slug: permission.slug });

      if (!existingPermission) {
        await StaffPermission.create(permission);
        createdCount++;
        console.log(`✅ Created permission: ${permission.name} (Group: ${permission.groupName})`);
      } else {
        skippedCount++;
        console.log(`⏭️ Skipped permission: ${permission.name} (already exists)`);
      }
    }

    console.log(`✅ Permissions seeding completed: ${createdCount} created, ${skippedCount} skipped`);
  } catch (error) {
    console.error("❌ Error seeding permissions:", error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};



export default seedPermissions();
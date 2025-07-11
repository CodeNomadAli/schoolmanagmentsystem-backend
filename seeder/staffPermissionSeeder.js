import mongoose from "mongoose";
import StaffPermission from "../models/staff_permission.model.js";

const permissions = [
  { name: "Create Users", slug: "create-users", description: "Can create user data" },
  { name: "Read Users", slug: "read-users", description: "Can read user data" },
  { name: "Update Users", slug: "update-users", description: "Can update user data" },
  { name: "Delete Users", slug: "delete-users", description: "Can delete user data" },
  { name: "Create Staff", slug: "create-staff", description: "Can create staff data" },
  { name: "Read Staff", slug: "read-staff", description: "Can read staff data" },
  { name: "Update Staff", slug: "update-staff", description: "Can update staff data" },
  { name: "Delete Staff", slug: "delete-staff", description: "Can delete staff data" },
  { name: "Create Role", slug: "create-role", description: "Can create role data" },
  { name: "Read Role", slug: "read-role", description: "Can read role data" },
  { name: "Update Role", slug: "update-role", description: "Can update role data" },
  { name: "Delete Role", slug: "delete-role", description: "Can delete role data" },
  { name: "Create Customer", slug: "create-customer", description: "Can create customer data" },
  { name: "Read Customer", slug: "read-customer", description: "Can read customer data" },
  { name: "Update Customer", slug: "update-customer", description: "Can update customer data" },
  { name: "Delete Customer", slug: "delete-customer", description: "Can delete customer data" },
  { name: "Create Remedy", slug: "create-remedy", description: "Can create remedy data" },
  { name: "Read Remedy", slug: "read-remedy", description: "Can read remedy data" },
  { name: "Update Remedy", slug: "update-remedy", description: "Can update remedy data" },
  { name: "Delete Remedy", slug: "delete-remedy", description: "Can delete remedy data" },
  { name: "Create Category", slug: "create-category", description: "Can create category data" },
  { name: "Read Category", slug: "read-category", description: "Can read category data" },
  { name: "Update Category", slug: "update-category", description: "Can update category data" },
  { name: "Delete Category", slug: "delete-category", description: "Can delete category data" },
];

const seedPermissions = async () => {
  await StaffPermission.deleteMany();
  const created = await StaffPermission.insertMany(permissions);
  console.log(`✅ Permissions seeded (${created.length})`);
  return created;
};

export default seedPermissions;

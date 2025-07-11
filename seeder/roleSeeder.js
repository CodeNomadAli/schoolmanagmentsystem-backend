// File: seeders/role-seeder.js
import mongoose from 'mongoose';
import StaffRole from '../models/staff_role.model.js';
import staffPermission from '../models/staff_permission.model.js';
import e from 'express';

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

async function seedRole() {
  await connectToDatabase();

  // Optional: Clear existing data
  await StaffRole.deleteMany({});
  console.log('Cleared existing roles');

  // Define seed data
  const roles = [
    { name: 'Super Admin', description: 'Administrator role with full access', permissions: [ 
      await staffPermission.findOne({ slug: 'create-users' }),
      await staffPermission.findOne({ slug: 'read-users' }),
      await staffPermission.findOne({ slug: 'update-users' }),
      await staffPermission.findOne({ slug: 'delete-users' }),

      await staffPermission.findOne({ slug: 'read-staff' }),
      await staffPermission.findOne({ slug: 'create-staff' }),
      await staffPermission.findOne({ slug: 'update-staff' }),
      await staffPermission.findOne({ slug: 'delete-staff' }),

      await staffPermission.findOne({ slug: 'read-role' }),
      await staffPermission.findOne({ slug: 'create-role' }),
      await staffPermission.findOne({ slug: 'update-role' }),
      await staffPermission.findOne({ slug: 'delete-role' }),
      await staffPermission.findOne({ slug: 'create-remedy' }),
      await staffPermission.findOne({ slug: 'read-remedy' }),
      await staffPermission.findOne({ slug: 'update-remedy' }),
      await staffPermission.findOne({ slug: 'delete-remedy' }),
      await staffPermission.findOne({ slug: 'create-category' }),
      await staffPermission.findOne({ slug: 'read-category' }),
      await staffPermission.findOne({ slug: 'update-category' }),
      await staffPermission.findOne({ slug: 'delete-category' }),
      
      ] },
    { name: 'Manager', description: 'Manager role with limited access', }
  ];

  // Create and save the roles
  try {
    await StaffRole.insertMany(roles);
    console.log('Roles seeded successfully');
  } catch (error) {
    console.error('Error seeding roles:', error);
  }

  // Close the database connection
  await mongoose.connection.close();
  console.log('Database connection closed');
}


export default seedRoles;


// File: seeders/role-seeder.js
import mongoose from 'mongoose';
import StaffRole from '../models/staff_role.model.js';

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
    { name: 'Super Admin', description: 'Administrator role with full access' },
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

seedRole();
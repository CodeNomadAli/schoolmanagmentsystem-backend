// File: seeders/role-seeder.js
import mongoose from 'mongoose';
import Staff from '../models/staff.model.js';
import StaffRole from '../models/staff_role.model.js';
import hashPassword from '../utils/hashPassword.js';

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
  await Staff.deleteMany({});
  console.log('Cleared existing staff data');

  const adminRole = await StaffRole.findOne({ name: 'Super Admin' });

  console.log('Admin Role:', adminRole);

  // Define seed data
  const staff = [
    {
      firstName: 'Super Admin',
      lastName: 'Admin',
      email: 'superadmin@gmail.com',
      password: await hashPassword('admin123'), // Assuming you have a method to hash passwords
      staffRoleId: adminRole.id,
    }
  ];

  // Create and save the roles
  try {
    await Staff.insertMany(staff);
    console.log('Admin seeded successfully');
  } catch (error) {
    console.error('Error seeding roles:', error);
  }

  // Close the database connection
  await mongoose.connection.close();
  console.log('Database connection closed');
}

seedRole();
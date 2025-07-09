// File: seeders/role-seeder.js
import mongoose from 'mongoose';
import Staff from '../models/staff.model.js';
import StaffRole from '../models/staff_role.model.js';
import hashPassword from '../utils/hashPassword.js';
import staffPermission from './staffPermissionSeeder.js'; // Adjust the import path as needed
import User from '../models/user.model.js';





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

  const permission = staffPermission.map((perm) => ({
    
    slug: perm.slug,
    
  }));
  console.log('Permissions:', permission);

async function seedRole() {
  await connectToDatabase();

  await Staff.deleteMany({});
  await User.deleteMany({});
  console.log('Cleared existing staff and user data');

  const adminRole = await StaffRole.findOne({ name: 'Super Admin' });
  let userRole = await StaffRole.findOne({ name: 'User' });

  if (!adminRole) throw new Error("Super Admin role not found");
  if (!userRole) {
    userRole = await StaffRole.create({ name: 'User' });
    console.log('Created missing User role');
  }

  const staff = [
    {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@gmail.com',
      password: await hashPassword('admin123'),
      staffRoleId: adminRole.id,
      permissions: permission, // Assigning permissions to the Super Admin    
    },
    {
      firstName: 'Ali',
      lastName: 'Khan',
      email: 'ali.khan@example.com',
      password: await hashPassword('user123'),
      staffRoleId: userRole.id,
    },
    {
      firstName: 'Sara',
      lastName: 'Yousuf',
      email: 'sara.yousuf@example.com',
      password: await hashPassword('user123'),
      staffRoleId: userRole.id,
    },
    {
      firstName: 'Ahmed',
      lastName: 'Zahid',
      email: 'ahmed.zahid@example.com',
      password: await hashPassword('user123'),
      staffRoleId: userRole.id,
    }
  ];

  let createdStaff;
  try {
    createdStaff = await Staff.insertMany(staff);
    console.log('Staff seeded successfully');
  } catch (error) {
    console.error('Error seeding staff:', error);
    await mongoose.connection.close();
    return;
  }

  const users = createdStaff.map((staffMember, index) => ({
    username: `${staffMember.firstName.toLowerCase()}${index + 1}`,
    email: staffMember.email,
    password: staffMember.password,
    staffId: staffMember._id,
    accessLevel: staffMember.staffRoleId.toString() === adminRole._id.toString() ? 'admin' : 'user',
    lastLogin: new Date(),
    isActive: true,
    emailVerified: true,
    twoFactorStatus: 'disabled',
    profileImage: '/user/default.png',
    status: 'active',
    emailVerificationRequestCount: 0,
    resetRequestCount: 0,
  }));

  try {
    await User.insertMany(users);
    console.log('User(s) seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  }

  await mongoose.connection.close();
  console.log('Database connection closed');
}




export default seedRole;
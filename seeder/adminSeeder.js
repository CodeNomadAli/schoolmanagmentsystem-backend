import mongoose from 'mongoose';
import Staff from '../models/staff.model.js';
import StaffRole from '../models/staff_role.model.js';
import hashPassword from '../utils/hashPassword.js';
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
    throw error;
  }
}

async function adminSeeder() {
  try {
    await connectToDatabase();

   
    console.log('Cleared existing staff and user data');

    const adminRole = await StaffRole.findOne({ name: 'Super Admin' });
    const writerRole = await StaffRole.findOne({ name: 'Writer' });
    let userRole = await StaffRole.findOne({ name: 'User' });

    if (!adminRole) throw new Error('Super Admin role not found');
    if (!writerRole) throw new Error('Writer role not found');

    if (!userRole) {
      userRole = await StaffRole.create({ name: 'User' });
      console.log('Created missing User role');
    }

    const staffData = [
      {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@gmail.com',
        password: await hashPassword('admin123'),
        staffRoleId: adminRole._id,
      },
      {
        firstName: 'Ali',
        lastName: 'Khan',
        email: 'writer@gmail.com',
        password: await hashPassword('writer123'),
        staffRoleId: writerRole._id,
      },
      {
        firstName: 'Sara',
        lastName: 'Yousuf',
        email: 'sara.yousuf@example.com',
        password: await hashPassword('user123'),
        staffRoleId: userRole._id,
      },
      {
        firstName: 'Ahmed',
        lastName: 'Zahid',
        email: 'ahmed.zahid@example.com',
        password: await hashPassword('user123'),
        staffRoleId: userRole._id,
      },
    ];

    // Insert staff, skipping existing by email
    const createdStaff = [];
    for (const staffMember of staffData) {
      const existing = await Staff.findOne({ email: staffMember.email });
      if (existing) {
        console.log(`Staff already exists: ${staffMember.email}`);
        createdStaff.push(existing);
        continue;
      }
      const created = await Staff.create(staffMember);
      console.log(`Inserted staff: ${staffMember.email}`);
      createdStaff.push(created);
    }

    // Map staff to user docs
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

    // Insert users, skipping existing by email
    for (const user of users) {
      const existingUser = await User.findOne({ email: user.email });
      if (existingUser) {
        console.log(`User already exists: ${user.email}`);
        continue;
      }
      await User.create(user);
      console.log(`Inserted user: ${user.username}`);
    }

    console.log('All users and staff seeded successfully');
  } catch (error) {
    console.error('Seeder error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

export default adminSeeder();

import Staff from "../models/staff.model.js";
import User from "../models/user.model.js";
import StaffRole from "../models/staff_role.model.js";
import hashPassword from "../utils/hashPassword.js";

const adminSeeder = async () => {
  await Staff.deleteMany();
  await User.deleteMany();

  const adminRole = await StaffRole.findOne({ name: "Super Admin" });
  const userRole = await StaffRole.findOneAndUpdate(
    { name: "User" },
    { name: "User" },
    { upsert: true, new: true }
  );

  const staffList = [
    {
      firstName: "Super",
      lastName: "Admin",
      email: "superadmin@gmail.com",
      password: await hashPassword("admin123"),
      staffRoleId: adminRole._id,
    },
    {
      firstName: "Ali",
      lastName: "Khan",
      email: "ali.khan@example.com",
      password: await hashPassword("user123"),
      staffRoleId: userRole._id,
    },
  ];

  const createdStaff = await Staff.insertMany(staffList);

  const users = createdStaff.map((s, i) => ({
    username: `${s.firstName.toLowerCase()}${i + 1}`,
    email: s.email,
    password: s.password,
    staffId: s._id,
    accessLevel: s.staffRoleId.toString() === adminRole._id.toString() ? "admin" : "user",
    lastLogin: new Date(),
    isActive: true,
    emailVerified: true,
    twoFactorStatus: "disabled",
    profileImage: "/user/default.png",
    status: "active",
  }));

  await User.insertMany(users);
  console.log("✅ Staff & Users seeded");
};

export default adminSeeder;

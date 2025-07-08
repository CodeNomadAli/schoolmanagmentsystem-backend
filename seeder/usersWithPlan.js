import mongoose from "mongoose";
import Users from "../models/user.model.js";
import UserSubscription from "../models/user_subscription.js";
import hashPassword from "../utils/hashPassword.js";

const now = new Date();
const addMonths = (date, months) => new Date(date.setMonth(date.getMonth() + months));
const addYears = (date, years) => new Date(date.setFullYear(date.getFullYear() + years));

const createUserWithSubscription = async (userData, subscriptionData) => {
  // Delete old user/sub if exists
  const existing = await Users.findOne({ email: userData.email });
  if (existing) {
    await Users.deleteOne({ _id: existing._id });
    await UserSubscription.deleteMany({ userId: existing._id });
    console.log(`🔁 Old user and subscription deleted for ${userData.email}`);
  }

  const user = await Users.create({
    ...userData,
    password: await hashPassword(userData.password),
  });

  await UserSubscription.create({
    userId: user._id,
    ...subscriptionData,
  });

  console.log(`✅ ${userData.email} created with ${subscriptionData.plan} plan`);
};

const seedUserSubscriptions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/remedy");

    const now = new Date();

    await createUserWithSubscription(
      {
        firstName: "Free",
        lastName: "User",
        username: "freeuser",
        email: "free@example.com",
        password: "free123",
      },
      {
        plan: "free",
        startDate: now,
        endDate: addYears(new Date(), 1),
        autoRenew: false,
        paymentStatus: "completed",
        features: [],
        monthlyPrice: 0,
        billingCycle: "yearly",
        nextBillingDate: addYears(new Date(), 1),
      }
    );

    await createUserWithSubscription(
      {
        firstName: "Premium",
        lastName: "Yearly",
        username: "premiumyear",
        email: "premium.year@example.com",
        password: "premium123",
      },
      {
        plan: "premium-year",
        startDate: now,
        endDate: addYears(new Date(), 1),
        autoRenew: true,
        paymentStatus: "completed",
        features: ["priority-support", "unlimited-access"],
        monthlyPrice: 120,
        billingCycle: "yearly",
        nextBillingDate: addYears(new Date(), 1),
      }
    );

    await createUserWithSubscription(
      {
        firstName: "Premium",
        lastName: "Monthly",
        username: "premiummonth",
        email: "premium.month@example.com",
        password: "premium123",
      },
      {
        plan: "premium-monthly",
        startDate: now,
        endDate: addMonths(new Date(), 1),
        autoRenew: true,
        paymentStatus: "completed",
        features: ["priority-support"],
        monthlyPrice: 15,
        billingCycle: "monthly",
        nextBillingDate: addMonths(new Date(), 1),
      }
    );

    await createUserWithSubscription(
      {
        firstName: "Pay",
        lastName: "Remedy",
        username: "payremedy",
        email: "payremedy@example.com",
        password: "payremedy123",
      },
      {
        plan: "pay-per-remedy",
        startDate: now,
        endDate: addMonths(new Date(), 1),
        autoRenew: false,
        paymentStatus: "pending",
        features: ["limited-access"],
        monthlyPrice: 5,
        billingCycle: "monthly",
        nextBillingDate: addMonths(new Date(), 1),
      }
    );

    console.log("✅ All user subscriptions seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding subscriptions:", error);
    process.exit(1);
  }
};

seedUserSubscriptions();

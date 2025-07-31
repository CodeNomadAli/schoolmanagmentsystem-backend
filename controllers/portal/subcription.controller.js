import stripe from "../../utils/stripe.js";
import { apiResponse } from "../../helper.js";
import User from "../../models/user.model.js";
import userPlan from "../../models/plan.model.js";
import mongoose from "mongoose";

export const createCheckoutSession = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { planId, userId, subscriptionType, token } = req.body;

    if (!planId || !userId || !subscriptionType || !token) {
      await session.abortTransaction();
      return res.status(400).json({
        error: "planId, userId, subscriptionType, and token are required.",
      });
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ error: "User not found." });
    }

    const planData = await userPlan.findOne({ planId }).session(session);
    if (!planData) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Plan not found." });
    }

    const price = await stripe.prices.retrieve(planId);
    if (!price) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Invalid planId." });
    }

    if (!user.stripeCustomerId) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ error: "User does not have Stripe Customer ID." });
    }

    const paymentMethod = await stripe.paymentMethods.retrieve(token);
    if (
      paymentMethod.customer &&
      paymentMethod.customer !== user.stripeCustomerId
    ) {
      await session.abortTransaction();
      return res.status(400).json({
        error: "Payment method already attached to another customer.",
      });
    }

    if (!paymentMethod.customer) {
      await stripe.paymentMethods.attach(token, {
        customer: user.stripeCustomerId,
      });
    }

    await stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: { default_payment_method: token },
    });

    const existingInvoice = user.invoices.find(
      (inv) =>
        inv.planName === planData.name &&
        inv.subscriptionType === "subscription"
    );

    if (subscriptionType === "payment") {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: price.unit_amount,
        currency: price.currency,
        customer: user.stripeCustomerId,
        payment_method: token,
        off_session: true,
        confirm: true,
      });

      if (existingInvoice && existingInvoice.isActive) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(409)
          .json(apiResponse(409, null, "Already subscribed to this plan."));
      } else {

        const baseInvoice = {
          price: planData.price,
          planName: planData.name,
          isActive: true,
          subscriptionType,
          startDate: new Date(),
          createdAt: new Date(),
          endDate: null,
        };


        user.invoices.push(baseInvoice);
      }

      
      user.accessLevel = "prouser";
      user.subscriptionStatus = "active";
      user.stripeToken = token;
      await user.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        message: "Payment succeeded.",
        paymentIntentId: paymentIntent.id,
      });
    } else if (subscriptionType === "subscription") {
      const subscription = await stripe.subscriptions.create({
        customer: user.stripeCustomerId,
        items: [{ price: planId }],
        default_payment_method: token,
        trial_period_days: 0,
        expand: ["latest_invoice.payment_intent"],
      });

     

      if (existingInvoice && existingInvoice.isActive) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(409)
          .json(apiResponse(409, null, "Already subscribed to this plan."));
      } else {
        user.invoices.push({
          price: planData.price,
          planName: planData.name,
          isActive: true,
          subscriptionType,
          startDate: new Date(),
          createdAt: new Date(),
          endDate: new Date(subscription.current_period_end * 1000),
        });
      }

      user.stripeSubscriptionId = subscription.id;
      user.accessLevel = "prouser";
      user.subscriptionStatus = "active";
      user.stripeToken = token;
      await user.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        message: "Subscription created successfully.",
        subscriptionId: subscription.id,
        paymentIntent: subscription.latest_invoice.payment_intent,
      });
    }

    await session.abortTransaction();
    session.endSession();
    return res
      .status(400)
      .json(
        apiResponse(
          400,
          null,
          "Invalid subscriptionType: 'payment' or 'subscription' expected."
        )
      );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Stripe Error:", error);
    return res
      .status(500)
      .json(apiResponse(500, null, "Payment failed: " + error.message));
  }
};

export const cancelSubscription = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { userId, subscriptionId, invoiceid } = req.body;

    if (!userId || !invoiceid) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "userId, invoiceid and subscriptionId are required.",
      });
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found." });
    }

    if (subscriptionId) {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    }

    const targetInvoice = user.invoices.find(
      (invoice) => invoice.invoiceid === invoiceid
    );
    if (targetInvoice) {
      targetInvoice.isActive = false;
      targetInvoice.endDate = new Date();
    }

    user.accessLevel = "user";
    user.subscriptionStatus = "inActive";
    user.stripeSubscriptionId = null;

    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Subscription cancelled successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Cancel error:", error.message);
    return res
      .status(500)
      .json({ error: `Internal server error: ${error.message}` });
  }
};

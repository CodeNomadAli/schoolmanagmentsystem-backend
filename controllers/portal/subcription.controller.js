import stripe from "../../utils/stripe.js";

import Card from "../../models/card.model.js";
import User from "../../models/user.model.js";
import userPlan from "../../models/plan.model.js";
import Invoice from "../../models/invoice.model.js";

export const createCheckoutSession = async (req, res) => {
  
  const { planId, userId, subscriptionType, token } = req.body;

  try {
    if (!planId || !userId || !subscriptionType || !token) {
      return res.status(400).json({
        error: "planId, userId, subscriptionType, and token are required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    const planData = await userPlan.findOne({ planId });
    if (!planData) return res.status(400).json({ error: "Plan not found." });

    const invoice = await Invoice.create({
      userId,
      planId,
      price: planData.price,
      planName: planData.name,
      subscriptionType,
      planStatus: user.subscriptionStatus,
    });

    const price = await stripe.prices.retrieve(planId);
    if (!price) return res.status(400).json({ error: "Invalid planId." });

    if (!user.stripeCustomerId) {
      return res.status(400).json({ error: "User does not have Stripe Customer ID." });
    }
       
    // Check if payment method is already attached
    const paymentMethod = await stripe.paymentMethods.retrieve(token);
          
    if (paymentMethod.customer && paymentMethod.customer !== user.stripeCustomerId) {
      return res.status(400).json({ error: "Payment method already attached to another customer." });
    }

    // Attach only if not attached
    if (!paymentMethod.customer) {
      await stripe.paymentMethods.attach(token, {
        customer: user.stripeCustomerId,
      });
    }
  
  

    await stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: { default_payment_method: token },
    });

    if (subscriptionType === "payment") {
      // One-time payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount: price.unit_amount,
        currency: price.currency,
        customer: user.stripeCustomerId,
        payment_method: token,
        off_session: true,
        confirm: true,
      });

      user.stripeToken = token;
      await user.save();

      return res.status(200).json({
        message: "Payment succeeded.",
        paymentIntentId: paymentIntent.id,
      });

    } else if (subscriptionType === "subscription") {
      // Subscription
      const subscription = await stripe.subscriptions.create({
        customer: user.stripeCustomerId,
        items: [{ price: planId }],
        trial_period_days: 0,
        expand: ["latest_invoice.payment_intent"],
        default_payment_method: token,
      });

      user.stripeSubscriptionId = subscription.id;
      user.subscriptionStatus = "active";
      user.stripeToken = token;
      await user.save();

      return res.status(200).json({
        message: "Subscription created successfully.",
        subscriptionId: subscription.id,
        paymentIntent: subscription.latest_invoice.payment_intent,
      });

    } else {
      return res.status(400).json({ error: "Invalid type: must be 'payment' or 'subscription'." });
    }
  } catch (error) {
    console.error("Stripe Payment Error:", error);
    return res.status(500).json({ error: "Payment failed: " + error.message });
  }
};








export const cancelSubscription = async (req, res) => {
  try {
    const { userId, subscriptionId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (!subscriptionId) {
      return res.status(400).json({ message: "Subscription ID required." });
    }


    const cancelled = await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });


    user.subscriptionStatus = "inActive";
    user.stripeSubscriptionId = null;
    await user.save();

    res.status(200).json({
      message: "Subscription cancelled successfully.",
      subscription: cancelled,
    });
  } catch (error) {
    console.error("Cancel error:", error.message);
    res.status(500).json({ message: "Error cancelling subscription" });
  }
};

import express from "express";
import stripe from "../../utils/stripe.js";
import bodyParser from "body-parser";
import User from "../../models/user.model.js";

const router = express.Router();

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
     console.log(req)
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const userId = session.client_reference_id;
        const mode = session.mode; 

        const user = await User.findById(userId);
        if (!user) return res.status(404).send("User not found");

        if (mode === "payment") {
          
          user.subscriptionType = "premium";
          user.subscriptionStatus = "active";
          user.subscriptionStart = new Date();
          user.stripeSubscriptionId = null;
        } else if (mode === "subscription") {
          
          user.subscriptionType = "subscription";
          user.subscriptionStatus = "active";
          user.subscriptionStart = new Date();
          user.stripeSubscriptionId = session.subscription;
        }

        await user.save();
      }

      if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const user = await User.findOne({ stripeCustomerId: customerId });
        if (user) {
          user.subscriptionStatus = "cancelled";
          user.stripeSubscriptionId = null;
          await user.save();
        }
      }

      res.json({ received: true });
    } catch (err) {
      console.error("Webhook handler error:", err.message);
      res.status(500).send("Webhook handler failed.");
    }
  }
);

export default router;

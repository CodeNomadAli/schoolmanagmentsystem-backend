import express from "express";
import stripe from "../utils/stripe.js";
import bodyParser from "body-parser";
import User from "../models/user.model.js";

const router = express.Router();

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

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
        const [userId, planId] = session.client_reference_id?.split("__") || [];

        if (!userId || !planId)
          return res.status(400).send("Missing userId or planId");

        const user = await User.findById(userId);
        if (!user) return res.status(404).send("User not found");

        const now = new Date();
        const endDate = new Date(now);
        endDate.setFullYear(now.getFullYear() + 1); // Or adjust for months

        const existingInvoice = user.invoices.find(
          (inv) => inv.isActive && inv.invoiceid === planId
        );

        if (existingInvoice) {
          existingInvoice.startDate = now;
          existingInvoice.endDate = endDate;
          existingInvoice.createdAt = now;
        } else {
          user.invoices.push({
            invoiceid: planId,
            planName: "Default Plan",
            subscriptionType:
              session.mode === "payment" ? "payment" : "subscription",
            isActive: true,
            price: session.amount_total / 100,
            discount: 0,
            startDate: now,
            endDate: endDate,
            createdAt: now,
          });
        }

        user.subscriptionStatus = "active";
        user.startDate = now;
        user.subscriptionType =
          session.mode === "payment" ? "payment" : "subscription";
        user.stripeSubscriptionId =
          session.mode === "subscription" ? session.subscription : null;

        await user.save();
      }

      if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const user = await User.findOne({ stripeCustomerId: customerId });
        if (user) {
          user.subscriptionStatus = "cancelled";
          user.stripeSubscriptionId = null;

          const activeInvoice = user.invoices.find(
            (inv) => inv.isActive && inv.subscriptionType === "subscription"
          );

          if (activeInvoice) {
            activeInvoice.isActive = false;
            activeInvoice.endDate = new Date();
          }

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

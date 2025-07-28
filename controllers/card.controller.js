import stripe from "../utils/stripe.js";
import Card from "../models/card.model.js";
import User from "../models/user.model.js";
export const addCard = async (req, res) => {
  try {
    const { userId, subscriptionType, cardName, token, lastDigits } = req.body;
 
     
    if (!userId || !subscriptionType || !token) {
      return res.status(400).json({ error: "All card fields are required." });
    }

    
    const user = await User.findById(userId);
    if (!user || !user.stripeCustomerId) {
      return res.status(404).json({ error: "User or Stripe customer not found." });
    }

    
    await stripe.paymentMethods.attach(token, {
      customer: user.stripeCustomerId,
    });

    
    await stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: token,
      },
    });

    
    const card = await Card.create({
      userId,
      subscriptionType,
      cardName,
      token,
      lastDigits,
    });

    res.status(201).json({ message: "Card added and attached successfully", card });

  } catch (err) {
    console.error("Add card error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getUserCards = async (req, res) => {
  try {
    const { userId } = req.params;
    const cards = await Card.find({ userId });
    res.status(200).json(cards);
  } catch (err) {
    console.error("Fetch cards error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    // 1. Check if the card exists
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found." });
    }

    // 2. Fetch the payment method from Stripe
    const paymentMethod = await stripe.paymentMethods.retrieve(card.token);
       console.log(paymentMethod,"payment method")
    // 3. Check if it's attached to a customer
    if (!paymentMethod.customer) {
      return res.status(400).json({ error: "Card is not attached to any customer." });
    }

    // 4. Detach the payment method
    await stripe.paymentMethods.detach(card.token);

    // 5. Delete from DB
    await Card.findByIdAndDelete(cardId);

    return res.status(200).json({ message: "Card successfully detached and deleted." });

  } catch (err) {
    console.error("Delete card error:", err.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};


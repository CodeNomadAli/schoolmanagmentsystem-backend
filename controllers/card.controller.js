import stripe from "../utils/stripe.js";
import User from "../models/user.model.js";


export const addCard = async (req, res) => {
  try {
    const {userId, subscriptionType, cardName, token, lastDigits } = req.body;
  //  console.log(req,"body of req")
    // console.log(req.body,"helo")
    if (!subscriptionType || !token) {
      return res.status(400).json({ error: "All card fields are required." });
    }

    const user = await User.findById(userId);
      
      
    if (!user || !user.stripeCustomerId) {
      return res.status(404).json({ error: "User or Stripe customer not found." });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(token, {
      customer: user.stripeCustomerId,
    });

    // Set as default payment method
    await stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: token,
      },
    });

    // Add card to embedded array
    const newCard = {
      subscriptionType,
      cardName,
      token,
      lastDigits,
    };

    user.cards.push(newCard);
    await user.save();

    res.status(201).json({
      message: "Card added and attached successfully",
      card: newCard,
    });
  } catch (err) {
    console.error("Add card error:", err.message);
    res.status(500).json({ error: "Internal server error" },err.message);
  }
};

// Get all cards from user's embedded array
export const getUserCards = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user.cards);
  } catch (err) {
    console.error("Fetch cards error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    
    const user = await User.findOne({ "cards._id": cardId });
    if (!user) {
      return res.status(404).json({ error: "User with this card not found." });
    }


    const card = user.cards.id(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found." });
    }

    if (card.token) {
      const paymentMethod = await stripe.paymentMethods.retrieve(card.token);
      if (paymentMethod.customer) {
        await stripe.paymentMethods.detach(card.token);
      }
    }

    card.remove();
    await user.save();

    res.status(200).json({ message: "Card detached and removed successfully." });
  } catch (err) {
    console.error("Delete card by ID error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
};



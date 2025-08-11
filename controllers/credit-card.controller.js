import stripe from "../utils/stripe.js";
import User from "../models/user.model.js";
import { apiResponse } from "../helper.js";


export const addCard = async (req, res) => {
  try {
    const {userId,  cardName, token, lastDigits } = req.body;
  
    if (!token) {
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
    res.status(500).json({ error: ` ${err.message}` });

  }
};

// Get all cards from user's embedded array
export const getUserCards = async (req, res) => {
  try {
    console.log(req,"req")
    const  userId  =  req.user?.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(apiResponse(200,user.cards, 'Data fetched successfully'));
  } catch (err) {
    console.error("Fetch cards error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a specific card from user's embedded array
// DELETE /api/cards/:userId/:token
export const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    
     const userId = req.user.id;
  
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    
    const card = user.cards.find((c) => c.cardId === cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found." });
    }

    const token= card.token
     
    // Detach from Stripe
    const paymentMethod = await stripe.paymentMethods.retrieve(cardId);
    if (paymentMethod.customer) {
      await stripe.paymentMethods.detach(token);
    }

    // Remove card from user.cards array
    user.cards = user.cards.filter((c) => c.token !== token);
    await user.save();

    res.status(200).json(apiResponse( 200, [], "Card detached and removed successfully."));
  } catch (err) {
    console.error("Delete card error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
};


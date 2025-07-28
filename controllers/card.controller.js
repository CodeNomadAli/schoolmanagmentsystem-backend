import stripe from "../utils/stripe.js";
import Card from "../models/card.model.js";

export const addCard = async (req, res) => {
  try {
    const { userId, subscriptionType, cardName, token,lastDigits } = req.body;
       console.log(req.body)       
    if (!userId || !subscriptionType  || !token) {
      return res.status(400).json({ error: "All card fields are required." });
    }

    const card = await Card.create({ userId, subscriptionType, cardName, token ,lastDigits});
    res.status(201).json({ message: "Card added successfully", card }); 
  } catch (err) {
    console.error("Add card error:", err.message);
    res.status(500).json({ error: "Internal server error", });
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

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found." });
    }

    await stripe.paymentMethods.detach(card.token);

    await Card.findByIdAndDelete(cardId);

    res.status(200).json({ message: "Card deleted and detached successfully." });
  } catch (err) {
    console.error("Delete card error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

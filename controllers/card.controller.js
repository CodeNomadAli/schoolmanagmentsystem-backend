// controllers/card.controller.js
import Card from "../models/card.model.js";

// ✅ Add new card
export const addCard = async (req, res) => {
  try {
    const { userId, type, cardName, token,lastDigits } = req.body;
       console.log(req.body)       
    if (!userId || !type  || !token) {
      return res.status(400).json({ error: "All card fields are required." });
    }

    const card = await Card.create({ userId, type, cardName, token ,lastDigits});
    res.status(201).json({ message: "Card added successfully", card }); 
  } catch (err) {
    console.error("Add card error:", err.message);
    res.status(500).json({ error: "Internal server error", });
  }
};

// ✅ Get all cards of a user
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

// ✅ Delete a card by ID
export const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    await Card.findByIdAndDelete(cardId);
    res.status(200).json({ message: "Card deleted successfully" });
  } catch (err) {
    console.error("Delete card error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

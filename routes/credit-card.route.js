import express from "express";
import {
  addCard,
  getUserCards,
  deleteCard,
} from "../controllers/credit-card.controller.js"; 

const router = express.Router();

// Change POST to PUT since we’re modifying the User document
router.put("/add", addCard);

router.get("/:userId", getUserCards);

router.delete("/:userId/:token", deleteCard);

export default router;

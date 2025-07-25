import express from "express";

import {
  addCard,
  getUserCards,
  deleteCard,
} from "../controllers/card.controller.js";

const router = express.Router();


router.post("/add", addCard);


router.get("/:userId", getUserCards);


router.delete("/:cardId", deleteCard);

export default router;

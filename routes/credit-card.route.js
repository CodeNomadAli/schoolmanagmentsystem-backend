import express from "express";
import {
  addCard,
  getUserCards,
  deleteCard,
} from "../controllers/credit-card.controller.js"; 

const router = express.Router();


router.get("/", getUserCards);
// Change POST to PUT since we’re modifying the User document
router.put("/add", addCard);



router.delete("/:cardId", deleteCard);

export default router;

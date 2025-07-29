import express from "express";
import {
  createInvoice,
  getInvoices,
  deleteInvoice,
} from "../controllers/invoice.controller.js";

const router = express.Router();


router.put("/create", createInvoice);

router.get("/:userId", getInvoices);

router.delete("/:userId/:invoiceId", deleteInvoice);

export default router;

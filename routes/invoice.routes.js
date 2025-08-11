import express from "express";
import {
  createInvoice,
  getInvoices,
  deleteInvoice,
} from "../controllers/invoice.controller.js";

const router = express.Router();


router.put("/create", createInvoice);

router.get("/", getInvoices);

router.delete("/:invoiceId", deleteInvoice);

export default router;

import express from "express";
import {
  createInvoice,
  getInvoices,
  deleteInvoice
} from "../controllers/invoice.controller.js";

const router = express.Router();

router.post("/create", createInvoice);        // POST /api/invoices
router.get("/", getInvoices);           // GET  /api/invoices
router.delete("/:id", deleteInvoice);   // DELETE /api/invoices/:id

export default router;

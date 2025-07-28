import Invoice from "../models/invoice.model.js";

// Create Invoice
export const createInvoice = async (req, res) => {
  try {
    const { planId, planName, subtype, amount, price, discount } = req.body;

    const invoice = new Invoice({ planId, planName, subtype, amount, price, discount });
    await invoice.save();

    res.status(201).json({ message: "Invoice created", invoice });
  } catch (error) {
    res.status(500).json({ message: "Failed to create invoice", error: error.message });
  }
};

// Get All Invoices
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("planId");
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Failed to get invoices", error: error.message });
  }
};

// Delete Invoice
export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    await Invoice.findByIdAndDelete(id);
    res.json({ message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete invoice", error: error.message });
  }
};

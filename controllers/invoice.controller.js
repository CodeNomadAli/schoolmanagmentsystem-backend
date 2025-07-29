import User from "../models/user.model.js";
import { apiResponse } from "../helper.js";

export const createInvoice = async (req, res) => {
  try {
    const {
      userId,
      planId,
      planName,
      subscriptionType,
      price,
      discount,
      startDate,
      endDate,
    } = req.body;

    if (!userId || !planId || !price) {
      return res
        .status(400)
        .json(apiResponse(400, null, "userId, planId and price are required"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json(apiResponse(404, null, "User not found"));
    }

    const newInvoice = {
      planId,
      planName,
      subscriptionType,
      price,
      discount: discount || 0,
      startDate: startDate || new Date(),
      endDate,
      createdAt: new Date(),
    };

    user.invoices.push(newInvoice);
    await user.save();

    return res
      .status(201)
      .json(apiResponse(201, newInvoice, "Invoice added to user successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(apiResponse(500, null, `Failed to add invoice: ${error.message}`));
  }
};

export const getInvoices = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json(apiResponse(400, null, "userId is required"));
    }

    const user = await User.findById(userId).select("invoices");
    if (!user) {
      return res
        .status(404)
        .json(apiResponse(404, null, "User not found"));
    }

    return res
      .status(200)
      .json(apiResponse(200, user.invoices, "Invoices fetched successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(apiResponse(500, null, `Failed to get invoices: ${error.message}`));
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const { userId, invoiceId } = req.params;

    if (!userId || !invoiceId) {
      return res
        .status(400)
        .json(apiResponse(400, null, "userId and invoiceId are required"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json(apiResponse(404, null, "User not found"));
    }

    const invoiceIndex = user.invoices.findIndex(
      (inv) => inv._id.toString() === invoiceId
    );

    if (invoiceIndex === -1) {
      return res
        .status(404)
        .json(apiResponse(404, null, "Invoice not found"));
    }

    user.invoices.splice(invoiceIndex, 1);
    await user.save();

    return res
      .status(200)
      .json(apiResponse(200, null, "Invoice deleted successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(apiResponse(500, null, `Failed to delete invoice: ${error.message}`));
  }
};

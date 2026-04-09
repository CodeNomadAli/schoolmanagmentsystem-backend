import Fee from "../models/fee.model.js";
import Student from "../models/student.model.js";
import { sendMail } from "../services/sendMail.service.js";
import { apiResponse } from "../helper.js";

// ---------------- CREATE ----------------
export const addFee = async (req, res) => {
  try {
    const { studentId, feeType, amount, dueDate, status } = req.body;
    const school_id = req.user.school_id;

    // 1️⃣ Find student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json(apiResponse(404, null, "Student not found"));
    }

    // 2️⃣ Create fee record
    const fee = await Fee.create({
      student: studentId,
      feeType,
      amount,
      dueDate,
      status,
      school_id,
    });

    // 3️⃣ Send email to student
    await sendMail({
      to: student.email,
      subject: `Fee ${status === "Paid" ? "Paid" : "Due"} Notification`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; padding:20px;">
          <h2>Hello ${student.fullName},</h2>
          <p>Your fee has been recorded with the following details:</p>
          <ul>
            <li>Fee Type: ${feeType}</li>
            <li>Amount: $${amount}</li>
            <li>Due Date: ${new Date(dueDate).toLocaleDateString()}</li>
            <li>Status: ${status}</li>
          </ul>
          <p>Please contact the school if you have any questions.</p>
        </div>
      `,
    });

    // 4️⃣ Send email to admin
    await sendMail({
      to: req.user.email,
      subject: `Fee Record Added for ${student.fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; padding:20px;">
          <h2>Fee Record Added</h2>
          <p>A fee record has been added for student <strong>${student.fullName}</strong>:</p>
          <ul>
            <li>Fee Type: ${feeType}</li>
            <li>Amount: $${amount}</li>
            <li>Due Date: ${new Date(dueDate).toLocaleDateString()}</li>
            <li>Status: ${status}</li>
          </ul>
        </div>
      `,
    });

    return res.status(201).json(apiResponse(201, fee, "Fee record added successfully and emails sent"));
  } catch (err) {
    console.error("Add fee error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- GET ALL ----------------
export const getFees = async (req, res) => {
  try {
    const fees = await Fee.find({ school_id: req.user.school_id })
      .populate({
        path: "student",
        select: "fullName email class",
        populate: {
          path: "class", // nested populate
          select: "className grade", // fields from Class model
        },
      });

    return res
      .status(200)
      .json(apiResponse(200, fees, "Fees fetched successfully"));
  } catch (err) {
    console.error("Get fees error:", err);
    return res
      .status(500)
      .json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- GET ONE ----------------
export const getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json(apiResponse(404, null, "Fee record not found"));
    return res.status(200).json(apiResponse(200, fee, "Fee fetched successfully"));
  } catch (err) {
    console.error("Get fee error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- UPDATE ----------------
export const updateFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json(apiResponse(404, null, "Fee record not found"));

    Object.keys(req.body).forEach((key) => {
      fee[key] = req.body[key];
    });

    await fee.save();
    return res.status(200).json(apiResponse(200, fee, "Fee updated successfully"));
  } catch (err) {
    console.error("Update fee error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};

// ---------------- DELETE ----------------
export const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json(apiResponse(404, null, "Fee record not found"));

    await fee.remove();
    return res.status(200).json(apiResponse(200, null, "Fee deleted successfully"));
  } catch (err) {
    console.error("Delete fee error:", err);
    return res.status(500).json(apiResponse(500, null, "Internal server error"));
  }
};
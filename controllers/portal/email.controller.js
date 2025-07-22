import { sendEmail } from "../helpers/emailHelper.js";
import { apiResponse } from "../helper.js";

export const sendEmail = async (req, res) => {
  try {
    const { userId, from, to, subject, body } = req.body;

    if (!userId || !from || !to || !subject || !body) {
      return res.status(400).json(apiResponse(400, null, "All fields are required"));
    }

    await sendEmail({ userId, from, to, subject, body });

    return res.status(200).json(apiResponse(200, null, "Email sent and logged successfully"));
  } catch (error) {
    console.error("Send email error:", error);
    return res.status(500).json(apiResponse(500, null, error.message || "Failed to send email"));
  }
};

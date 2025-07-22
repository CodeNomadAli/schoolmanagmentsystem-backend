import { apiResponse } from "../../helper.js";
import { sendEmailHelper } from "../../helper/emailLogger.js";
import EmailLog from "../../models/email_log.model.js"; 

export const sendEmail = async (req, res) => {
  const { to, subject, body } = req.body;
   const userId = req.user ? req.user._id : null;
   
   if (!to || !subject || !body) {

    return res
      .status(400)
      .json(apiResponse(400, null, "Missing required fields"));
  }

  try {
    await sendEmailHelper({ to, subject, html: body });

    await EmailLog.create({userId, to, subject, body, status: "sent" });

    return res
      .status(200)
      .json(apiResponse(200, null, "Email sent successfully"));
  } catch (error) {
    await EmailLog.create({
      to,
      subject,
      body,
      userId,
      status: "failed",
      errorMessage: error.message,
    });

    return res.status(500).json(apiResponse(500, null, "Email failed to send"));
  }
};

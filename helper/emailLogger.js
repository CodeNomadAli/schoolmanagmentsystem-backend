import EmailLog from "../models/email_log.model.js";
import { sendMail } from "../services/sendMail.service.js";

const emailNotify = async (to, subject, body, userId) => {
  try {
    await sendMail({
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color:#007bff;">${subject}</h2>
          <p style="color:#333;">${body}</p>
          <br />
          <p style="font-size: 0.9rem; color: #888;">
            You're receiving this email from Remloy.
          </p>
        </div>
      `,
    });

     await EmailLog.create({
      userId,
      to,
      subject,
      body,
    });
 console.log(`✅ Email sent to ${to} with subject: ${subject}`);
    console.log(`✅ Email sent to ${to} | Subject: ${subject}`);
  } catch (error) {
    console.error(`❌ Email to ${to} failed:`, error.message);
  }
};

export default emailNotify;

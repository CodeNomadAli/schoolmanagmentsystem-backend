import transporter from "../utils/mailer.js";
import EmailLog from "../models/emailLog.model.js";


export const logEmail = async ({ userId, from, to, subject, body, status = "sent" }) => {
  try {
    await EmailLog.create({ userId, from, to, subject, body, status });
    console.log("✅ Email log saved");
  } catch (error) {
    console.error("❌ Failed to save email log:", error);
  }
};


export const sendEmail = async ({ userId, from, to, subject, body }) => {
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html: body,
    });

    console.log("📤 Email sent:", info.messageId);

    await logEmail({ userId, from, to, subject, body, status: "sent" });
  } catch (error) {
    console.error("❌ Failed to send email:", error);


    await logEmail({ userId, from, to, subject, body, status: "failed" });
  }
};

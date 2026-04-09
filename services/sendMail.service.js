// services/mailService.js
import transporter from "../config/mailer.config.js";

export const sendMail = async ({ to, subject, html }) => {
 const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER, 
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
   console.log(error.message,"helo email erro")
  }
};

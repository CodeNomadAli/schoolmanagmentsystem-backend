// services/mailService.js
import transporter from "../config/mailer.config.js";

export const sendMail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"Remloy" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
   console.log(error.message)
  }
};

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()

const transporter = nodemailer.createTransport({
   host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT, 10),
  secure: true, // true for 465
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;

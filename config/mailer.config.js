// config/mailer.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()

var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "885c3fb24abe4c",
    pass: "e2bd1df3e39a24"
  }
});

export default transporter;

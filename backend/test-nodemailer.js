require("dotenv").config();
const nodemailer = require("nodemailer");

async function sendTestEmail() {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email from Nodemailer",
      text: "This is a test email to verify your SMTP credentials.",
    });

    console.log("Test email sent:", info.response);
  } catch (err) {
    console.error("Nodemailer test error:", err);
    if (err && err.response) {
      console.error("Nodemailer response error:", err.response);
    }
    if (err && err.stack) {
      console.error("Stack trace:", err.stack);
    }
  }
}

sendTestEmail();

require("dotenv").config();
const nodemailer = require("nodemailer"); // import nodemailer to send emails
const fs = require("fs");
const path = require("path");

// Configure the SMTP transporter
const transporter = nodemailer.createTransport({
  // configure the email transporter using environment variables for SMTP settings
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// verify the transporter connection.
transporter.verify((error, success) => {
  if (error) console.error("❌ SMTP Error:", err);
  else console.log("✅ Email Server is ready to send emails !");
});

/**
 * Send an email
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} [options.text] - Plain text version
 * @param {string} [options.html] - HTML version
 */

// here this part is send to the other side where the email part is access by.
module.exports = async function sendEmail({
  to,
  subject,
  text,
  template,
  variables,
}) {
  // send email function to send the email to the user
  try {
    let html = text || ""; // fallback plain text

    // here i use the template to send the html responce.
    if (template) {
      const templatePath = path.join(__dirname, "templates", template);
      html = fs.readFileSync(templatePath, "utf-8");

      // Replace placeholders with actual variables
      if (variables) {
        Object.keys(variables).forEach((key) => {
          const regex = new RegExp(`{{${key}}}`, "g");
          html = html.replace(regex, variables[key]);
        });
      }
    }

    // this is to send the mail
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text: text || html.replace(/<[^>]+>/g, ""), // fallback plain text
      html,
    });
    // console.log(`✅ Email sent to ${to}: ${info.messageId}`);
  } catch (err) {
    console.error("❌ Email error:", err);
  }
};

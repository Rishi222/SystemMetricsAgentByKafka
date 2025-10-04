const nodemailer = require("nodemailer");                 // import nodemailer to send emails   

// here i still want to configure this or check it.
const transporter = nodemailer.createTransport({                            // configure the email transporter using environment variables for SMTP settings
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { 
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS 
  },
});

module.exports = async function sendEmail({ to, subject, text, html }) {                // send email function to send the email to the user
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
};

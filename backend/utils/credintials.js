// get-ethereal-credentials.js
const nodemailer = require("nodemailer");

async function getCredentials() {
  const testAccount = await nodemailer.createTestAccount();
  console.log("=== ETHEREAL CREDENTIALS ===");
  console.log("SMTP_HOST:", testAccount.smtp.host);
  console.log("SMTP_PORT:", testAccount.smtp.port);
  console.log("SMTP_USER:", testAccount.user);
  console.log("SMTP_PASS:", testAccount.pass);
  console.log("==============================");
  console.log("Preview emails at: https://ethereal.email/login");
}

getCredentials();

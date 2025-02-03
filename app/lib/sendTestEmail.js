import sgMail from "@sendgrid/mail";

const hardcodedKey =
  "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";

console.log("Hardcoded API Key is defined:", !!hardcodedKey);
console.log("Key starts with SG.:", hardcodedKey.startsWith("SG."));

sgMail.setApiKey(hardcodedKey);

async function sendTestEmail() {
  try {
    const msg = {
      to: "fabehas@yopmail.com",
      from: "k2110157@kingston.ac.uk",
      subject: "Test Email from SendGrid",
      text: "This is a test email sent using SendGrid.",
      html: "<strong>This is a test email sent using SendGrid.</strong>",
    };

    const response = await sgMail.send(msg);
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response?.body || error.message
    );
  }
}

sendTestEmail();

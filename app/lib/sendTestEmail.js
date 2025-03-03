import sgMail from "@sendgrid/mail";

const hardcodedKey =
  "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";

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
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response?.body || error.message
    );
  }
}

sendTestEmail();

const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// -------------------- GMAIL OAUTH2 --------------------
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,        // For Gmail OAuth2
  process.env.CLIENT_SECRET
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function sendEmail(to, link, subject, html) {
  try {
    let transporter;

    if (process.env.EMAIL_SERVICE === "gmail") {
      const accessToken = await oAuth2Client.getAccessToken();

      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL_USER,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: accessToken
        }
      });
    } else {
      // -------------------- YAHOO --------------------
      transporter = nodemailer.createTransport({
        service: "yahoo",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS // Yahoo app password
        }
      });
    }

    await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log("✅ Email sent to:", to);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
}

module.exports = sendEmail;

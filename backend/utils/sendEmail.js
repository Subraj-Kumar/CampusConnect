const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  console.log("🔍 Checking Email Config:", {
    user: process.env.EMAIL_USER ? "FOUND" : "MISSING",
    pass: process.env.EMAIL_PASS ? "FOUND" : "MISSING"
  });

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // 👈 Trying Port 587 (Standard for StartTLS)
      secure: false, // 👈 Must be false for port 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false // 👈 Helps bypass strict handshake failures on cloud networks
      },
      // 🚀 THE ULTIMATE RENDER STABILITY SETTINGS:
      family: 4,
      connectionTimeout: 30000, // Increased to 30 seconds
      greetingTimeout: 30000,
      socketTimeout: 30000,
      pool: true // 👈 Keeps the connection open to avoid repeated handshakes
    });

    const mailOptions = {
      from: `"CampusConnect" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    
  } catch (error) {
    console.error("❌ Email Service Error:", error.message);
  }
};

module.exports = sendEmail;
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  // DEBUG: Check if variables are loading
  console.log("🔍 Checking Email Config:", {
    user: process.env.EMAIL_USER ? "FOUND" : "MISSING",
    pass: process.env.EMAIL_PASS ? "FOUND" : "MISSING"
  });

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      // 🚀 THE CRITICAL FIXES FOR RENDER:
      family: 4,           // Forces IPv4 to resolve ENETUNREACH errors
      connectionTimeout: 15000, // Wait 15s for slow campus/cloud networks
      greetingTimeout: 15000,
      socketTimeout: 15000
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
    // We catch the error so the whole server doesn't crash during your demo
    console.error("❌ Email Service Error:", error.message);
  }
};

module.exports = sendEmail;
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  // DEBUG: Confirms environment variables are reaching the cloud instance
  console.log("🔍 Checking Email Config:", {
    user: process.env.EMAIL_USER ? "FOUND" : "MISSING",
    pass: process.env.EMAIL_PASS ? "FOUND" : "MISSING"
  });

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // Use 465 for implicit SSL/TLS
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      // 🚀 THE PRODUCTION FIXES:
      family: 4,           // Forces IPv4 to resolve ENETUNREACH errors on Render
      connectionTimeout: 25000, // Wait 20s - essential for campus/cloud latency
      greetingTimeout: 25000,
      socketTimeout: 25000,
      pool: true,          // Keeps connection open for multiple emails (efficient)
      maxConnections: 1,
      maxMessages: 10
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
    // Prevents a total crash during your Science Day demonstration
    console.error("❌ Email Service Error:", error.message);
  }
};

module.exports = sendEmail;
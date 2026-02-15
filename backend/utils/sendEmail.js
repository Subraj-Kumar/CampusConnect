const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  // DEBUG: Check if variables are loading (Remove after testing)
  console.log("Checking Email Config:", {
    user: process.env.EMAIL_USER ? "FOUND" : "MISSING",
    pass: process.env.EMAIL_PASS ? "FOUND" : "MISSING"
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"CampusConnect" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
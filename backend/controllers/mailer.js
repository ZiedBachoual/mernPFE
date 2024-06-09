const nodemailer = require('nodemailer');

// sending the mail to reset 
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const sendResetEmail = async (email, resetToken) => {
    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Click the link to reset your password: ${resetURL}`,
    };
  
    await transporter.sendMail(mailOptions);
  };

  module.exports = { sendResetEmail };

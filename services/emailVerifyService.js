import nodemailer from 'nodemailer';

const formData = require('form-data');
const Mailgun = require('mailgun.js');

// const transporter = nodemailer.createTransport({
//   host: 'smtp.example.com', // Replace with your SMTP host
//   port: 587,                 // Common SMTP port
//   secure: false,             // Use true for port 465
//   auth: {
//     user: 'your-email@example.com',
//     pass: 'your-email-password' // Use an app password if necessary
//   },
//   connectionTimeout: 5000,  // 5 seconds
//   greetingTimeout: 5000,     // 5 seconds
//   socketTimeout: 5000        // 5 seconds
// });

export const sendVerificationEmail = async (email, verificationLink) => {
  console.log(email, verificationLink);
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY || '' });

  try {
    const mailOptions = {
      from: 'Inovision TEAM <mailgun@sandbox0d9f1fbcad704b10a06dd5df74fdec02.mailgun.org>',
      to: email,
      subject: 'メールアドレスを確認',
      html: `
        <h1>メールアドレスを確認</h1>
        <p>メールアドレスを確認するには、以下のリンクをクリックしてください。:</p>
        <a href="${verificationLink}">Verify Email</a>
      `
    };

    return await mg.messages.create(process.env.MAILGUN_DOMAIN, mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};
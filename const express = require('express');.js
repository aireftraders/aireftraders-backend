const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const codes = {}; // Store email and 2FA codes temporarily

app.post('/api/send-2fa-code', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  const code = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit code
  codes[email] = code;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Use environment variable
      pass: process.env.EMAIL_PASS, // Use environment variable
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your 2FA Code',
    text: `Your 2FA code is: ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: '2FA code sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send 2FA code.' });
  }
});

app.post('/api/verify-2fa-code', (req, res) => {
  const { email, code } = req.body;
  if (codes[email] && codes[email] === parseInt(code, 10)) {
    delete codes[email]; // Remove code after successful verification
    res.status(200).json({ message: '2FA code verified successfully.' });
  } else {
    res.status(400).json({ message: 'Invalid 2FA code.' });
  }
});

app.get('/api/sent-2fa-emails', (req, res) => {
  const sentEmails = Object.keys(codes);
  res.status(200).json({ emails: sentEmails });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => process.exit(0));
});
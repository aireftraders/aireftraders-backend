const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const codes = {}; // Store email and 2FA codes temporarily
const codesExpiry = {}; // Store expiry times for 2FA codes

// Rate limiter for 2FA code requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use('/api/send-2fa-code', limiter);

// Middleware to clean up expired codes
setInterval(() => {
  const now = Date.now();
  for (const email in codesExpiry) {
    if (codesExpiry[email] < now) {
      delete codes[email];
      delete codesExpiry[email];
    }
  }
}, 60 * 1000); // Run every minute

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error('EMAIL_USER and EMAIL_PASS must be set in environment variables.');
}

app.post('/api/send-2fa-code', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  const code = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit code
  codes[email] = code;
  codesExpiry[email] = Date.now() + 5 * 60 * 1000; // Set expiry time to 5 minutes

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
    delete codesExpiry[email]; // Remove expiry time after successful verification
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
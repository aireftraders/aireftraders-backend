require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = require('./app');
const PORT = process.env.PORT || 5000;

// Enable CORS for the frontend
app.use(cors({
  origin: process.env.WEBAPP_URL, // Frontend URL from .env
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Serve static files (including favicon)
app.use(express.static(path.join(__dirname, 'public')));

// Scheduled Tasks
cron.schedule('0 0 * * *', () => {
  console.log('Running daily streak check...');
  require('./services/streakService').checkStreaks();
});

cron.schedule('*/5 * * * *', () => {
  console.log('Checking payment batches...');
  require('./services/batchMonitor').checkBatches();
});

cron.schedule('0 * * * *', () => {
  console.log('Cleaning up expired sessions...');
  require('./services/sessionService').cleanupExpiredSessions();
});

// Mock admin credentials from .env file
const adminCredentials = {
  username: 'admin',
  password: process.env.ADMIN_PASSWORD,
  email: process.env.ADMIN_EMAIL
};

// Store 2FA codes temporarily
const twoFACodes = {};

// API to send 2FA code
app.post('/api/send-2fa-code', (req, res) => {
  const { email } = req.body;

  if (email !== adminCredentials.email) {
    return res.status(400).json({ success: false, message: 'Invalid email address.' });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  twoFACodes[email] = code;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: adminCredentials.email,
      pass: adminCredentials.password
    }
  });

  const mailOptions = {
    from: adminCredentials.email,
    to: email,
    subject: 'Your 2FA Code',
    text: `Your 2FA code is: ${code}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
    console.log('Email sent:', info.response);
    res.json({ success: true });
  });
});

// API to verify 2FA code
app.post('/api/verify-2fa-code', (req, res) => {
  const { email, code } = req.body;

  if (twoFACodes[email] === code) {
    delete twoFACodes[email];
    return res.json({ success: true });
  }

  res.status(400).json({ success: false, message: 'Invalid 2FA code.' });
});

// Payment webhook
app.post('/api/payments/callback', (req, res) => {
  const secretHash = process.env.FLW_SECRET_HASH;
  const signature = req.headers['verif-hash'];

  if (!signature || signature !== secretHash) {
    return res.status(401).send('Unauthorized');
  }

  console.log('Payment webhook received:', req.body);
  res.status(200).send('Webhook received');
});

// Transfer webhook
app.post('/api/withdrawals/callback', (req, res) => {
  const secretHash = process.env.FLW_SECRET_HASH;
  const signature = req.headers['verif-hash'];

  if (!signature || signature !== secretHash) {
    return res.status(401).send('Unauthorized');
  }

  console.log('Transfer webhook received:', req.body);
  res.status(200).send('Webhook received');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

// Catch-all route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Server Initialization
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please use a different port.`);
    process.exit(1);
  } else {
    throw err;
  }
});

// Error Handlers
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});
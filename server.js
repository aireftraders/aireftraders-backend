// server.js
require('dotenv').config();
const cron = require('node-cron'); // Only declare ONCE at the top
const app = require('./app');
const PORT = process.env.PORT || 5000;
const nodemailer = require('nodemailer');

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

const users = [
  { id: 1, username: 'user1', role: 'Admin' },
  { id: 2, username: 'user2', role: 'User' },
  { id: 3, username: 'user3', role: 'Moderator' },
];

const announcements = [];
const supportRequests = [
  { id: 1, username: 'user1', message: 'I need help with my account.' },
  { id: 2, username: 'user2', message: 'How do I reset my password?' },
  { id: 3, username: 'user3', message: 'I have a payment issue.' },
];

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

  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: adminCredentials.email, // Use admin email from .env
      pass: adminCredentials.password // Use admin password from .env
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
    delete twoFACodes[email]; // Remove the code after successful verification
    return res.json({ success: true });
  }

  res.status(400).json({ success: false, message: 'Invalid 2FA code.' });
});

// API to fetch admin email
app.get('/api/admin-email', (req, res) => {
  if (process.env.ADMIN_EMAIL) {
    res.status(200).json({ email: process.env.ADMIN_EMAIL });
  } else {
    res.status(500).json({ message: 'Admin email not configured.' });
  }
});

app.get('/api/users', (req, res) => {
  res.status(200).json(users);
});

app.post('/api/users/:id/role', (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = users.find((u) => u.id === parseInt(id, 10));
  if (user) {
    user.role = role;
    res.status(200).json({ message: 'Role updated successfully.' });
  } else {
    res.status(404).json({ message: 'User not found.' });
  }
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const index = users.findIndex((u) => u.id === parseInt(id, 10));
  if (index !== -1) {
    users.splice(index, 1);
    res.status(200).json({ message: 'User deleted successfully.' });
  } else {
    res.status(404).json({ message: 'User not found.' });
  }
});

app.post('/api/announcements', (req, res) => {
  const { message } = req.body;
  if (message) {
    announcements.push({ id: announcements.length + 1, message });
    res.status(201).json({ message: 'Announcement created successfully.' });
  } else {
    res.status(400).json({ message: 'Message is required.' });
  }
});

app.get('/api/announcements', (req, res) => {
  res.status(200).json(announcements);
});

app.delete('/api/announcements/:id', (req, res) => {
  const { id } = req.params;
  const index = announcements.findIndex((a) => a.id === parseInt(id, 10));
  if (index !== -1) {
    announcements.splice(index, 1);
    res.status(200).json({ message: 'Announcement deleted successfully.' });
  } else {
    res.status(404).json({ message: 'Announcement not found.' });
  }
});

app.get('/api/support-requests', (req, res) => {
  res.status(200).json(supportRequests);
});

app.post('/api/support-requests/:id/respond', (req, res) => {
  const { id } = req.params;
  const request = supportRequests.find((r) => r.id === parseInt(id, 10));
  if (request) {
    res.status(200).json({ message: `Responded to support request from ${request.username}.` });
  } else {
    res.status(404).json({ message: 'Support request not found.' });
  }
});

app.post('/api/notifications', (req, res) => {
  const { message } = req.body;
  if (message) {
    res.status(200).json({ message: 'Notification sent successfully.' });
  } else {
    res.status(400).json({ message: 'Message is required.' });
  }
});

// Server Initialization
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
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
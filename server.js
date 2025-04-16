require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/database');
const adRoutes = require('./routes/adRoutes');

// Initialize Express app
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for development
if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
}

// Updated CORS configuration to include the current frontend Render URL
app.use(cors({
  origin: [
    'https://aireftraders-frontend.onrender.com', // Updated frontend Render URL
    'https://aireftraders-backend.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Serve static files from the project folder
app.use(express.static(path.join(__dirname, 'project')));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Use the adRoutes with a base prefix
app.use('/api', adRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  console.log('[ROUTE HIT] GET /api/health');
  res.json({ success: true, message: 'Server is running' });
});

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  const frontendRoot = path.join(__dirname, 'public'); // Assuming final frontend files are here
  app.use(express.static(frontendRoot));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendRoot, 'index.html'));
  });
}

// Catch 404 errors for undefined routes
app.use((req, res, next) => {
  console.log(`404 Error: ${req.method} ${req.url} not found`);
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack || err.message);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Trying a different port...`);
    const newPort = parseInt(PORT) + 1;
    app.listen(newPort, () => {
      console.log(`Server running on port ${newPort}`);
    }).on('error', (err) => {
      console.error('Server error:', err);
    });
  } else {
    console.error('Server error:', err);
  }
});
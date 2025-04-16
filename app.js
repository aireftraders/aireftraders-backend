require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Updated CORS configuration to include the frontend Render URL
const corsOptions = {
  origin: [
    'https://aireftraders-frontend.onrender.com', // Frontend Render URL
    'http://localhost:5500' // For local development
  ],
  credentials: true
};

app.use(cors(corsOptions));

// Ensure the backend URL is consistent
const BACKEND_URL = process.env.BACKEND_URL || 'https://aireftraders-backend.onrender.com';

// Middleware to redirect incorrect frontend requests
app.use((req, res, next) => {
  if (req.headers.origin && req.headers.origin.includes('backend.onrender.com')) {
    res.redirect(301, `${BACKEND_URL}${req.originalUrl}`);
  } else {
    next();
  }
});

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Test database connection route
app.get('/test-db', async (req, res) => {
  try {
    console.log('[DEBUG] Testing database connection');
    const result = await mongoose.connection.db.admin().ping();
    console.log('[DEBUG] Database connection successful:', result);
    res.json({ success: true, result });
  } catch (error) {
    console.error('[ERROR] Database connection failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const adRoutes = require('./routes/adRoutes');

// Use adRoutes for ad-related endpoints
app.use('/api/ads', adRoutes);

module.exports = app;
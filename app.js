require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Basic CORS configuration
const corsOptions = {
  origin: [
    process.env.WEBAPP_URL,
    'https://v0-new-project-kpsjngutvqx.vercel.app',
    'https://aireftraders-backend.onrender.com',
    ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [])
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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

module.exports = app;
require('dotenv').config();
const path = require('path');
const express = require('express'); // Add this line
const app = require('./app');
const PORT = process.env.PORT || 5000;

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));

// Route imports
const routes = [
  { path: '/api/auth', router: require('./routes/authRoutes') },
  { path: '/api/admin', router: require('./routes/adminRoutes') },
  { path: '/api/users', router: require('./routes/userRoutes') },
  { path: '/api/transactions', router: require('./routes/transactionRoutes') },
  { path: '/api/webhooks', router: require('./routes/webhookRoutes') },
  { path: '/api/games', router: require('./routes/gameRoutes') },
  { path: '/', router: require('./routes/webRoutes') }
];

// Register routes
routes.forEach(route => {
  app.use(route.path, route.router);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server;

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Telegram Auth Middleware
const verifyTelegramAuth = (req, res, next) => {
  try {
    // Your Telegram auth logic here
    next();
  } catch (error) {
    res.status(401).json({ error: 'Telegram authentication failed' });
  }
};

// Ensure Admin Middleware
const ensureAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Authentication Middleware
const authenticate = async (req, res, next) => {
  try {
    console.log('Authenticate middleware triggered for route:', req.originalUrl);
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token
    });

    if (!user) throw new Error();

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// Is Admin Check Middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ error: 'Admin privileges required' });
};

module.exports = {
  verifyTelegramAuth,
  ensureAdmin,
  authenticate,
  isAdmin
};
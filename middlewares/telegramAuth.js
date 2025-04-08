const crypto = require('crypto');
const User = require('../models/User');

exports.verifyTelegramAuth = (req, res, next) => {
  const initData = req.header('Telegram-Init-Data');
  if (!initData) return res.status(401).json({ error: 'Unauthorized' });

  // Verification logic here
  next();
};

exports.ensureAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ telegramId: req.telegramUser.id });
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
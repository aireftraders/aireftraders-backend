const crypto = require('crypto');
const User = require('../models/User');

exports.verifyTelegramAuth = (req, res, next) => {
  const initData = req.header('Telegram-Init-Data');
  if (!initData) return res.status(401).json({ error: 'Unauthorized' });

  console.log('Received Telegram-Init-Data header:', initData);

  // Verification logic for Telegram Init Data
  const secretKey = process.env.TELEGRAM_BOT_TOKEN; // Ensure this is set in your environment variables
  const hash = crypto.createHash('sha256').update(secretKey).digest('hex');

  if (initData !== hash) {
    console.error('Invalid Telegram-Init-Data header');
    return res.status(401).json({ error: 'Unauthorized: Invalid Telegram-Init-Data' });
  }

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
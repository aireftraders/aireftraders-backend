const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLoginStreak = async (req, res) => {
  try {
    const userId = req.user._id;
    // Implementation for login streak
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
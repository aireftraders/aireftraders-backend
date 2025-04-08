const User = require('../models/User');

exports.updateLoginStreak = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    const today = new Date().toDateString();
    const lastLogin = user.lastLogin?.toDateString();
    
    // Check if already logged in today
    if (lastLogin === today) {
      return res.json({ 
        streak: user.loginStreak,
        bonus: 0,
        alreadyLoggedIn: true
      });
    }
    
    // Calculate streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isConsecutive = user.lastLogin?.toDateString() === yesterday.toDateString();
    
    const newStreak = isConsecutive ? user.loginStreak + 1 : 1;
    const bonusAmount = calculateStreakBonus(newStreak);
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, {
      loginStreak: newStreak,
      lastLogin: new Date(),
      $inc: { balance: bonusAmount },
      $push: {
        streakBonusHistory: {
          date: new Date(),
          amount: bonusAmount,
          streakDay: newStreak
        }
      }
    }, { new: true });
    
    res.json({
      streak: updatedUser.loginStreak,
      bonus: bonusAmount,
      alreadyLoggedIn: false
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function calculateStreakBonus(streak) {
  // ₦500 for day 1, increasing by ₦100 each day up to day 7 (₦1100)
  return 500 + (Math.min(streak, 7) - 1) * 100;
}
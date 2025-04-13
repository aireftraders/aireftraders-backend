const User = require('../models/User');

exports.updateLoginStreak = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const today = new Date().toDateString();
    const lastLogin = user.lastLogin?.toDateString();

    if (lastLogin === today) {
      return res.json({ streak: user.loginStreak, bonus: 0, alreadyLoggedIn: true });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isConsecutive = user.lastLogin?.toDateString() === yesterday.toDateString();

    const newStreak = isConsecutive ? user.loginStreak + 1 : 1;
    const bonusAmount = calculateStreakBonus(newStreak);

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

    res.json({ streak: updatedUser.loginStreak, bonus: bonusAmount, alreadyLoggedIn: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function calculateStreakBonus(streak) {
  return 500 + (Math.min(streak, 7) - 1) * 100;
}
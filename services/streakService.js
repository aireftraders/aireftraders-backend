const User = require('../models/User');

exports.checkStreaks = async () => {
  try {
    // Reset streaks for users who didn't log in today
    await User.updateMany(
      { 
        lastLogin: { $lt: new Date(new Date().setHours(0,0,0,0)) },
        loginStreak: { $gt: 0 }
      },
      { loginStreak: 0 }
    );
    console.log('Streak reset completed');
  } catch (error) {
    console.error('Error in streak check:', error);
  }
};
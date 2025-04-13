const { sendEmail } = require('./emailService');
const { sendTelegramNotification } = require('./telegramService');
const User = require('../models/User');
const Announcement = require('../models/Announcement');

exports.notifyUser = async (userId, message) => {
  try {
    // Implementation to notify user via multiple channels
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.notifyAdmin = async (message) => {
  try {
    await sendTelegramNotification(process.env.ADMIN_TELEGRAM_ID, message);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.notifyQualifiedUsers = async () => {
  try {
    // Fetch users who meet the qualification criteria
    const qualifiedUsers = await User.find({ isVerified: true }).limit(1000);

    if (qualifiedUsers.length >= 1000) {
      // Create an announcement
      const announcement = await Announcement.create({
        title: 'Congratulations! You are Qualified!',
        message: 'You have been qualified for our special program. Take action now!',
        priority: 'high',
        recipients: qualifiedUsers.map(user => ({ userId: user._id }))
      });

      console.log('Announcement created:', announcement);

      // Notify users via Telegram
      for (const user of qualifiedUsers) {
        await sendTelegramNotification(user.telegramId, announcement.message);
      }

      return { success: true, message: 'Notification sent to qualified users.' };
    } else {
      return { success: false, message: 'Not enough qualified users yet.' };
    }
  } catch (error) {
    console.error('Error notifying qualified users:', error);
    return { success: false, error: error.message };
  }
};
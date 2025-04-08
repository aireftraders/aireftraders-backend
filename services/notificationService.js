const { sendEmail } = require('./emailService');
const { sendTelegramNotification } = require('./telegramService');

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
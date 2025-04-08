const bot = require('../config/telegram');

exports.sendTelegramNotification = async (chatId, message) => {
  try {
    await bot.sendMessage(chatId, message);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
// Add this export to your existing telegramService.js
exports.sendWebAppNotification = async (userId, message) => {
  try {
    await bot.sendMessage(userId, message, {
      reply_markup: {
        inline_keyboard: [[
          {
            text: 'Open in App',
            web_app: { url: process.env.WEBAPP_URL }
          }
        ]]
      }
    });
    return { success: true };
  } catch (error) {
    console.error('Telegram notification failed:', error);
    return { success: false, error: error.message };
  }
};
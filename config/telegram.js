const TelegramBot = require('node-telegram-bot-api');

// Ensure the token is defined
if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables.');
}

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: false
});

// Add error handling for bot operations
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

module.exports = bot;
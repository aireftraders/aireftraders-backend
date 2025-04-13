class TelegramAuthError extends Error {
    constructor(message) {
      super(message);
      this.name = 'TelegramAuthError';
      this.statusCode = 401;
    }
  }
  
  module.exports = {
    TelegramAuthError
  };
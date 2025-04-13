const rateLimit = require('express-rate-limit');

module.exports = {
  authLimiter: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many login attempts',
    standardHeaders: true
  }),
  apiLimiter: rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: 'Too many requests',
    standardHeaders: true
  })
};
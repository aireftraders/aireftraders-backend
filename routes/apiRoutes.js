const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');

// Import controllers with validation
const getController = (name) => {
  try {
    const controller = require(`../controllers/${name}Controller`);
    if (!controller) throw new Error(`Controller ${name} not found`);
    return controller;
  } catch (error) {
    console.error(`Error loading ${name}Controller:`, error.message);
    return {
      // Fallback methods if controller fails to load
      getAdForGame: (req, res) => res.status(501).json({ error: 'Ad service not implemented' }),
      recordAdView: (req, res) => res.status(501).json({ error: 'Ad service not implemented' })
    };
  }
};

// Initialize controllers
const controllers = {
  user: getController('user'),
  bank: getController('bank'),
  payment: getController('payment'),
  referral: getController('referral'),
  trading: getController('trading'),
  game: getController('game'),
  ad: getController('ad')
};

// Apply authentication middleware
router.use(authenticate);

// Ad routes (now with fallback protection)
router.get('/ads/:gameType', controllers.ad.getAdForGame);
router.post('/ads/view', controllers.ad.recordAdView);

// Add route for recording game results
router.post('/game/result', controllers.game.recordGameResult);

// Add route for fetching user profile
router.get('/user/profile', controllers.user.getUserProfile);

// ... rest of your routes remain the same ...

module.exports = router;
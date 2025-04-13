const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');

// Import controllers with validation
const getController = (name) => {
  try {
    console.log(`Attempting to load controller: ${name}`);
    const controller = require(`../controllers/${name}Controller`);
    console.log(`Successfully loaded controller: ${name}`);
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
  trading: getController('trading')
};

console.log('Loaded controllers:', controllers);

const adController = require('../controllers/adController');
const gameController = require('../controllers/gameController');

// Add temporary debugging endpoint for ads before authentication middleware
router.get('/debug/ads', async (req, res) => {
  try {
    const ads = await require('../models/Ad').find();
    res.json({ success: true, ads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Temporarily bypass authentication for ad routes
router.get('/ads/:gameType', adController.getAdForGame);
router.post('/ads/view', adController.recordAdView);

// Apply authentication middleware
router.use(authenticate);

// Replace the game route to directly use gameController
router.post('/game/result', gameController.recordGameResult);

// Add route for fetching user profile
router.get('/user/profile', controllers.user.getUserProfile);

// Add route for user login
router.post('/user/login', controllers.user.login);

// Add route for creating a new user
router.post('/api/user', controllers.user.createUser);

module.exports = router;
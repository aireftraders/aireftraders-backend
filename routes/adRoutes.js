const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const Ad = require('../models/Ad'); // Assuming Ad model is defined
const User = require('../models/User'); // Assuming a User model exists
const { authenticate } = require('../middlewares/auth');

// Log route hits
router.get('/ads/:gameType', async (req, res) => {
  try {
    const { gameType } = req.params;
    console.log(`[ROUTE HIT] GET /api/ads/${gameType}`);

    const ad = await Ad.findOne({ gameTypes: { $in: [gameType] } });
    console.log('Ad found:', ad);

    if (!ad) {
      return res.status(404).json({ success: false, error: `No ad found for the game type: ${gameType}` });
    }

    res.json({ success: true, ad });
  } catch (error) {
    console.error('[ERROR] GET /api/ads/:gameType:', error.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.post('/ads/view', (req, res, next) => {
  console.log('[ROUTE HIT] POST /api/ads/view');
  next();
}, adController.recordAdView);

// Record ad view
router.post('/view', async (req, res) => {
  try {
    const { adId, gameType } = req.body;

    if (!adId || !gameType) {
      return res.status(400).json({ success: false, error: 'Ad ID and game type are required' });
    }

    // Simulate recording the ad view (e.g., incrementing a counter in the database)
    console.log(`Ad viewed: ${adId} for game: ${gameType}`);
    res.json({ success: true, message: 'Ad view recorded successfully' });
  } catch (error) {
    console.error('Error recording ad view:', error.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// New route for checking ad access
router.get('/ads/check-access', authenticate, adController.checkAdAccess);

// Endpoint to track ad views
router.post('/track-ad-view', async (req, res) => {
  try {
    const userId = req.session.userId; // Assuming session management is in place
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Increment ad view count in the database for the user
    const user = await User.findByIdAndUpdate(userId, { $inc: { adsWatched: 1 } }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Ad view recorded', adsWatched: user.adsWatched });
  } catch (error) {
    console.error('Error tracking ad view:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to check access to the game section
router.get('/check-access', async (req, res) => {
  try {
    const userId = req.session.userId; // Assuming session management is in place
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Retrieve user's ad view count from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hasAccess = user.adsWatched >= 20;
    res.json({ hasAccess });
  } catch (error) {
    console.error('Error checking access:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

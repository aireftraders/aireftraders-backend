// controllers/adController.js
const Ad = require('../models/Ad');
const User = require('../models/User');
const Activity = require('../models/Activity');

exports.getAdForGame = async (req, res) => {
  try {
    console.log('[CONTROLLER] getAdForGame called');
    const { gameType } = req.params;
    console.log('Game type:', gameType);

    if (!gameType) {
      console.log('Game type is missing');
      return res.status(400).json({ success: false, error: 'Game type is required' });
    }

    const ad = await Ad.findOne({ gameTypes: { $in: [gameType] } });
    console.log('Ad found:', ad);

    if (!ad) {
      console.log('No ad found for game type:', gameType);
      return res.status(404).json({ success: false, error: `No ad found for the game type: ${gameType}` });
    }

    res.json({ success: true, ad });
  } catch (error) {
    console.error('[ERROR] getAdForGame:', error.stack || error.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

exports.recordAdView = async (req, res) => {
  try {
    console.log('[CONTROLLER] recordAdView called');
    const { adId, userId } = req.body;
    console.log('Ad ID:', adId, 'User ID:', userId);

    if (!adId || !userId) {
      console.log('Ad ID or User ID is missing');
      return res.status(400).json({ success: false, error: 'Ad ID and User ID are required' });
    }

    const ad = await Ad.findById(adId);
    console.log('Ad found:', ad);

    if (!ad) {
      console.log('No ad found for ID:', adId);
      return res.status(404).json({ success: false, error: 'Ad not found' });
    }

    ad.views = (ad.views || 0) + 1;
    await ad.save();
    console.log('Ad view count updated:', ad.views);

    // Log activity
    await Activity.create({
      userId,
      action: 'recordAdView',
      details: { adId }
    });

    res.json({ success: true, message: 'Ad view recorded successfully' });
  } catch (error) {
    console.error('[ERROR] recordAdView:', error.stack || error.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

exports.checkAdAccess = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch user data
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Check if the user has watched at least 20 ads
        const adsWatched = user.adsWatched || 0;
        const requiredAds = 20;

        if (adsWatched >= requiredAds) {
            return res.json({ success: true, hasAccess: true });
        } else {
            return res.json({ success: true, hasAccess: false });
        }
    } catch (error) {
        console.error('Error checking ad access:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};
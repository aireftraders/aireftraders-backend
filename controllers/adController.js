// controllers/adController.js
const Ad = require('../models/Ad');

exports.getAdForGame = async (req, res) => {
  try {
    const { gameType } = req.params;

    // Validate gameType
    if (!gameType) {
      return res.status(400).json({
        success: false,
        error: 'Game type is required'
      });
    }

    // Fetch ad from the database
    const ad = await Ad.findOne({ gameType });
    if (!ad) {
      return res.status(404).json({
        success: false,
        error: 'No ad found for the specified game type'
      });
    }

    res.json({
      success: true,
      ad
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.recordAdView = async (req, res) => {
  try {
    const { adId, userId } = req.body;

    // Validate request body
    if (!adId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Ad ID and User ID are required'
      });
    }

    // Update ad view count in the database
    const ad = await Ad.findById(adId);
    if (!ad) {
      return res.status(404).json({
        success: false,
        error: 'Ad not found'
      });
    }

    ad.views = (ad.views || 0) + 1;
    await ad.save();

    res.json({ 
      success: true,
      message: 'Ad view recorded successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};
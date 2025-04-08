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

    // Basic implementation - replace with your actual ad logic
    const ad = {
      id: 'sample-ad',
      gameType,
      content: `Special offer for ${gameType} players!`,
      imageUrl: 'https://example.com/ads/sample.jpg',
      duration: 30
    };

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
    // Validate request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Request body is required'
      });
    }

    // Basic implementation - replace with your actual tracking logic
    console.log('Ad view recorded:', req.body);

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
const User = require('../models/User');
const Game = require('../models/Game');

// Controller methods
exports.updateGameAttempts = async (req, res) => {
  try {
    const { gameType, attempts } = req.body;
    const userId = req.user._id;

    const updateField = `gameAttempts.${gameType}`;
    const user = await User.findByIdAndUpdate(userId, {
      [updateField]: attempts
    }, { new: true });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.recordGamePlay = async (req, res) => {
  try {
    const { gameType } = req.body;
    const userId = req.user._id;

    const updateField = `gamePlayCounts.${gameType}`;
    const user = await User.findByIdAndUpdate(userId, {
      $inc: { [updateField]: 1 }
    }, { new: true });

    res.json({ success: true, playCount: user.gamePlayCounts[gameType] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.recordGameResult = async (req, res) => {
  try {
    const { gameType, result, earnings } = req.body;
    const userId = req.user._id;
    
    const update = {
      $inc: {
        attemptsUsed: 1,
        earnings: earnings || 0
      },
      lastPlayed: new Date()
    };
    
    if (result?.score) {
      update.$max = { highScore: result.score };
    }
    
    if (result?.outcome === 'win') {
      update.$inc.winStreak = 1;
    } else if (result?.outcome === 'lose') {
      update.winStreak = 0;
    }
    
    const game = await Game.findOneAndUpdate(
      { userId, gameType },
      update,
      { new: true, upsert: true }
    );
    
    if (earnings > 0) {
      await User.findByIdAndUpdate(userId, {
        $inc: { balance: earnings }
      });
    }
    
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
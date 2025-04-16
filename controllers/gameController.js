const User = require('../models/User');
const Game = require('../models/Game');
const Activity = require('../models/Activity');

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

exports.updateGameProgress = async (req, res) => {
  try {
    console.log('[DEBUG] updateGameProgress called with:', req.body);
    const userId = req.user._id; // Extract userId from authenticated user
    const { gameType, progress, earnings } = req.body;

    // Validate input
    if (!gameType) {
      console.log('[ERROR] Game type is missing');
      return res.status(400).json({ success: false, message: 'Game type is required.' });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      console.log('[ERROR] User not found:', userId);
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Update game progress and earnings
    console.log('[DEBUG] Updating game progress for user:', userId);
    user.games = user.games || {};
    user.games[gameType] = {
      progress: progress || user.games[gameType]?.progress || 0,
      earnings: (user.games[gameType]?.earnings || 0) + (earnings || 0),
    };

    await user.save();

    // Log activity
    console.log('[DEBUG] Logging activity for user:', userId);
    await Activity.create({
      userId,
      action: 'updateGameProgress',
      details: { gameType, progress, earnings }
    });

    res.json({ success: true, message: 'Game progress updated successfully.', games: user.games });
  } catch (error) {
    console.error('[ERROR] Error updating game progress:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
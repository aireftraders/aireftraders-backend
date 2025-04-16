const User = require('../models/User');
const Activity = require('../models/Activity');

exports.toggleTrading = async (req, res) => {
  try {
    const userId = req.user._id;

    // Atomic toggle of tradingActive
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      [{ $set: { tradingActive: { $not: "$tradingActive" } } }], // MongoDB aggregation pipeline
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, tradingActive: updatedUser.tradingActive });
  } catch (error) {
    console.error("Error toggling trading status:", error);
    res.status(500).json({ error: "An error occurred while toggling trading status" });
  }
};

exports.activateTrading = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Activate trading
    user.tradingActive = true;
    await user.save();

    // Log activity
    await Activity.create({
      userId,
      action: 'activateTrading',
      details: { tradingActive: true }
    });

    res.json({ success: true, message: 'Trading activated successfully.' });
  } catch (error) {
    console.error('Error activating trading:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.calculateDailyProfit = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user data
    const user = await User.findById(userId);
    if (!user || !user.tradingActive) {
      return res.status(400).json({ success: false, message: 'Trading is not active for this user.' });
    }

    // Calculate daily profit (20-50% of trading capital)
    const dailyProfit = Math.floor(user.tradingCapital * (Math.random() * (0.5 - 0.2) + 0.2));

    // Update user data
    user.dailyProfit = dailyProfit;
    user.totalProfit += dailyProfit;
    user.withdrawableProfit += dailyProfit;
    await user.save();

    // Log activity
    await Activity.create({
      userId,
      action: 'calculateDailyProfit',
      details: { dailyProfit }
    });

    res.json({ success: true, dailyProfit, totalProfit: user.totalProfit, withdrawableProfit: user.withdrawableProfit });
  } catch (error) {
    console.error('Error calculating daily profit:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.calculateProfitPercentage = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user data
    const user = await User.findById(userId);
    if (!user || !user.tradingActive) {
      return res.status(400).json({ success: false, message: 'Trading is not active for this user.' });
    }

    // Check if the user has watched 20 ads
    const adsWatched = user.adsWatched || 0;
    if (adsWatched < 20) {
      return res.json({ success: true, profitPercentage: 0 });
    }

    // Determine the current time range
    const now = new Date();
    const hours = now.getHours();
    let profitPercentage;

    if (hours >= 0 && hours < 7) {
      profitPercentage = Math.floor(Math.random() * (50 - 35 + 1)) + 35; // 35% – 50%
    } else if (hours >= 8 && hours < 16) {
      profitPercentage = Math.floor(Math.random() * (34 - 21 + 1)) + 21; // 21% – 34%
    } else if (hours >= 17 && hours < 24) {
      profitPercentage = 20; // 20% Flat
    } else {
      profitPercentage = 0; // Default to 0%
    }

    res.json({ success: true, profitPercentage });
  } catch (error) {
    console.error('Error calculating profit percentage:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
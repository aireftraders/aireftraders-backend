const User = require('../models/User');

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
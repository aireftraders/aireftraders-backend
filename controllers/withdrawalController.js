const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');

exports.requestWithdrawal = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id;
    
    // Validate minimum amount
    if (amount < 5000) {
      return res.status(400).json({ error: 'Minimum withdrawal is ₦5000' });
    }
    
    // Check user balance
    const user = await User.findById(userId);
    if (user.withdrawableProfit < amount) {
      return res.status(400).json({ error: 'Insufficient withdrawable balance' });
    }
    
    // Check if user has verified bank details
    if (!user.bankDetails?.verified) {
      return res.status(400).json({ error: 'Bank account not verified' });
    }
    
    // Create withdrawal request
    const withdrawal = await Withdrawal.create({
      userId,
      amount,
      bankDetails: user.bankDetails,
      status: 'pending'
    });
    
    // Deduct from user's withdrawable balance
    user.withdrawableProfit -= amount;
    await user.save();
    
    res.json(withdrawal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
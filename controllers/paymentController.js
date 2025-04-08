const User = require('../models/User');
const PaymentBatch = require('../models/PaymentBatch');
const { processPayment } = require('../services/flutterwaveService');

exports.payVerificationFee = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({ error: 'Invalid user information' });
    }

    const userId = req.user._id;
    const payment = await processPayment({
      userId,
      amount: 550,
      description: 'Account verification fee'
    });

    if (!payment || !payment.success) {
      return res.status(400).json({ error: 'Payment failed' });
    }

    const user = await User.findByIdAndUpdate(userId, {
      verificationFeePaid: true
    }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
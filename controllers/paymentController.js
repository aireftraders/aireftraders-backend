const User = require('../models/User');
const PaymentBatch = require('../models/PaymentBatch');
const { processPayment } = require('../services/flutterwaveService');

exports.payVerificationFee = async (req, res) => {
  try {
    console.log('Payment verification initiated');

    if (!req.user || !req.user._id) {
      console.error('Invalid user information');
      return res.status(400).json({ error: 'Invalid user information' });
    }

    const userId = req.user._id;
    console.log(`Processing payment for user ID: ${userId}`);

    const payment = await processPayment({
      userId,
      amount: 550,
      description: 'Account verification fee'
    });

    if (!payment || !payment.success) {
      console.error('Payment failed', payment);
      return res.status(400).json({ error: 'Payment failed' });
    }

    console.log('Payment successful, updating user record');

    const user = await User.findByIdAndUpdate(userId, {
      verificationFeePaid: true
    }, { new: true });

    if (!user) {
      console.error('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User record updated successfully');
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error in payVerificationFee:', error);
    res.status(500).json({ error: error.message });
  }
};
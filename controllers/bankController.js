const User = require('../models/User');
const { verifyBankAccount } = require('../services/flutterwaveService');
const nigerianBanks = require('../utils/nigerianBanks');

exports.bindBankAccount = async (req, res) => {
  try {
    const { bankName, accountNumber } = req.body;
    const userId = req.user._id;

    const verification = await verifyBankAccount({
      account_number: accountNumber,
      account_bank: bankName
    });

    if (verification.status !== 'success') {
      return res.status(400).json({ error: 'Bank verification failed' });
    }

    const user = await User.findByIdAndUpdate(userId, {
      bankDetails: {
        bankName,
        accountNumber,
        accountName: verification.data.account_name,
        verified: true
      },
      isVerified: true
    }, { new: true });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBankList = async (req, res) => {
  try {
    // Could also fetch from database if needed
    res.json(nigerianBanks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
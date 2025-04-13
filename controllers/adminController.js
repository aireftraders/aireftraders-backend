const PaymentBatch = require('../models/PaymentBatch');
const { processBatchWithdrawals } = require('../services/flutterwaveService');
const { sendTelegramNotification } = require('../services/telegramService');
const Ad = require('../models/Ad'); // Added missing import for Ad model
const User = require('../models/User'); // Added missing import for User model
const Withdrawal = require('../models/Withdrawal'); // Added missing import for Withdrawal model
const Transaction = require('../models/Transaction'); // Added missing import for Transaction model

exports.processBatchWithdrawals = async (req, res) => {
  try {
    const { batchId } = req.params;
    const result = await processBatchWithdrawals(batchId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.overrideThreshold = async (req, res) => {
  try {
    const { newThreshold } = req.body;
    // Implementation to override threshold
    res.json({ success: true, newThreshold });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.extendGracePeriod = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { additionalHours } = req.body;
    // Implementation to extend grace period
    res.json({ success: true, additionalHours });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendAnnouncement = async (req, res) => {
  try {
    const { message } = req.body;
    // Implementation to send announcements
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAdAnalytics = async (req, res) => {
  try {
    const analytics = await Ad.aggregate([
      {
        $lookup: {
          from: 'adviews',
          localField: '_id',
          foreignField: 'adId',
          as: 'views'
        }
      },
      {
        $project: {
          network: 1,
          code: 1,
          viewCount: { $size: '$views' },
          earnings: { $multiply: ['$earningsPerView', { $size: '$views' }] }
        }
      }
    ]);
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getPlatformAnalytics = async (req, res) => {
  try {
    const [
      userCount,
      verifiedUsers,
      activeTraders,
      pendingWithdrawals,
      totalEarnings,
      adRevenue
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ tradingActive: true }),
      Withdrawal.countDocuments({ status: 'pending' }),
      Transaction.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      Ad.aggregate([{ $group: { _id: null, total: { $sum: '$earnings' } } }])
    ]);
    
    res.json({
      userCount,
      verifiedUsers,
      activeTraders,
      pendingWithdrawals,
      totalEarnings: totalEarnings[0]?.total || 0,
      adRevenue: adRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getDashboardStats = async (req, res) => {
  // Implementation...
};

exports.processBatchWithdrawals = async (req, res) => {
  // Implementation...
};

exports.processBatchPayouts = async (req, res) => {
  // Implementation...
};

exports.overrideThreshold = async (req, res) => {
  // Implementation...
};

exports.verifyUser = async (req, res) => {
  // Implementation...
};

exports.extendGracePeriod = async (req, res) => {
  // Implementation...
};

exports.createAnnouncement = async (req, res) => {
  // Implementation...
};

exports.sendAnnouncement = async (req, res) => {
  // Implementation...
};
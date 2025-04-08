const User = require('../models/User');

exports.getReferralInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    res.json({
      referralCount: user.referralCount,
      referralEarnings: user.referralEarnings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.validateReferralCode = async (req, res) => {
  try {
    const { code } = req.body;
    // Check if code exists and is valid
    const referrer = await User.findOne({ referralCode: code });
    
    if (!referrer) {
      return res.status(400).json({ error: 'Invalid referral code' });
    }
    
    res.json({ 
      valid: true,
      referrerName: `${referrer.firstName} ${referrer.lastName}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.processReferral = async (userId, referrerCode) => {
  try {
    const referrer = await User.findOne({ referralCode: referrerCode });
    
    if (referrer) {
      // Update both users
      await User.findByIdAndUpdate(referrer._id, {
        $inc: {
          referralCount: 1,
          referralEarnings: 5000, // ₦5000 per referral
          balance: 5000
        }
      });
      
      await User.findByIdAndUpdate(userId, {
        $inc: { balance: 5000 }, // Bonus for referred user
        referredBy: referrer._id
      });
      
      // Create referral record
      await Referral.create({
        referrer: referrer._id,
        referredUser: userId
      });

      return { success: true, message: 'Referral processed successfully' };
    } else {
      return { success: false, message: 'Invalid referral code' };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};
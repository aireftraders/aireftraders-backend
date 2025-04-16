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

exports.checkReferralBonus = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user data
    const user = await User.findById(userId).populate('referrals');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Check if the user has 6 completed referrals within 24 hours
    const now = new Date();
    const signUpTime = new Date(user.createdAt);
    const timeDifference = (now - signUpTime) / (1000 * 60 * 60); // Time difference in hours

    const completedReferrals = user.referrals.filter(ref => ref.isCompleted);

    if (completedReferrals.length >= 6 && timeDifference <= 24) {
      // Add bonus to user's balance
      user.balance += 5000;
      await user.save();

      return res.json({ success: true, message: 'Bonus of ₦5000 awarded for completing 6 referrals within 24 hours.' });
    }

    res.json({ success: false, message: 'Referral bonus criteria not met.' });
  } catch (error) {
    console.error('Error checking referral bonus:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
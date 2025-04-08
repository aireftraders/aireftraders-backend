const mongoose = require('mongoose');

const AdViewSchema = new mongoose.Schema({
  adId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Ad',
    required: true
  },
  gameType: {
    type: String,
    enum: ['memory', 'dice', 'snake', 'trivia', 'wheel'],
    required: true
  },
  viewedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const StreakBonusSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  streakDay: {
    type: Number,
    required: true,
    min: 1
  }
});

const BankDetailsSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: function() {
      return this.verified; // Required only when verified is true
    }
  },
  accountNumber: {
    type: String,
    required: function() {
      return this.verified;
    },
    validate: {
      validator: function(v) {
        // Basic Nigerian account number validation (10 digits)
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid account number!`
    }
  },
  accountName: {
    type: String,
    required: function() {
      return this.verified;
    }
  },
  verified: {
    type: Boolean,
    default: false
  }
});

const UserSchema = new mongoose.Schema({
  // Telegram Information
  telegramId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  username: {
    type: String,
    trim: true,
    lowercase: true
  },
  firstName: {
    type: String,
    trim: true,
    required: true
  },
  lastName: {
    type: String,
    trim: true
  },
  
  // Financial Information
  balance: { 
    type: Number, 
    default: 5000,
    min: 0
  },
  tradingCapital: { 
    type: Number, 
    default: 0,
    min: 0
  },
  dailyProfit: { 
    type: Number, 
    default: 0,
    min: 0
  },
  totalProfit: { 
    type: Number, 
    default: 0,
    min: 0
  },
  withdrawableProfit: { 
    type: Number, 
    default: 0,
    min: 0
  },
  
  // Verification & Banking
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  verificationFeePaid: { 
    type: Boolean, 
    default: false 
  },
  bankDetails: BankDetailsSchema,
  
  // Referral System
  referralCount: { 
    type: Number, 
    default: 0,
    min: 0
  },
  referralEarnings: { 
    type: Number, 
    default: 0,
    min: 0
  },
  
  // Advertisements
  adsWatched: { 
    type: Number, 
    default: 0,
    min: 0
  },
  adViews: [AdViewSchema],
  
  // Trading Status
  tradingActive: { 
    type: Boolean, 
    default: false 
  },
  
  // Admin Status
  isAdmin: { 
    type: Boolean, 
    default: false 
  },
  
  // Login Streak System
  lastLogin: { 
    type: Date 
  },
  loginStreak: { 
    type: Number, 
    default: 0,
    min: 0
  },
  lastStreakBonus: { 
    type: Date 
  },
  streakBonusHistory: [StreakBonusSchema],
  
  // Game Attempts
  gameAttempts: {
    memory: { 
      type: Number, 
      default: 10,
      min: 0
    },
    dice: { 
      type: Number, 
      default: 10,
      min: 0
    },
    snake: { 
      type: Number, 
      default: 10,
      min: 0
    },
    trivia: { 
      type: Number, 
      default: 10,
      min: 0
    },
    wheel: { 
      type: Number, 
      default: 10,
      min: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
UserSchema.index({ isVerified: 1 });
UserSchema.index({ 'bankDetails.verified': 1 });
UserSchema.index({ createdAt: 1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

// Pre-save hook for lastLogin updates
UserSchema.pre('save', function(next) {
  if (this.isModified('lastLogin') || this.isNew) {
    // Add streak logic here if needed
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
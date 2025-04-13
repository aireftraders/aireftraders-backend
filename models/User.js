const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Sub-schemas
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
      return this.verified;
    }
  },
  accountNumber: {
    type: String,
    required: function() {
      return this.verified;
    },
    validate: {
      validator: function(v) {
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

// Main User Schema
const UserSchema = new mongoose.Schema({
  // Authentication
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  name: {
    type: String,
    required: true,
    trim: true
  },

  // Telegram Information
  telegramId: { 
    type: String, 
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
    trim: true
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

// Indexes
UserSchema.index({ isVerified: 1 });
UserSchema.index({ 'bankDetails.verified': 1 });
UserSchema.index({ createdAt: 1 });

// Virtuals
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

// Pre-save hooks
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Methods
UserSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

// Statics
UserSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error('Unable to login');
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Unable to login');
  
  return user;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
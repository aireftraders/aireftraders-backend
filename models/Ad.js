// models/Ad.js
const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
  // Identification
  title: {
    type: String,
    required: true,
    trim: true
  },
  network: {
    type: String,
    required: true,
    enum: ['Adsterra', 'Monetag', 'Cointzilla', 'Adsense', 'Custom'],
    default: 'Custom'
  },
  code: {
    type: String,
    required: function() {
      return this.network !== 'Custom';
    },
    unique: true
  },

  // Content
  content: {
    type: String,
    trim: true
  },
  mediaUrl: String, // For storing ad media URLs
  targetUrl: String, // Click destination

  // Display properties
  duration: {
    type: Number, // in seconds
    default: 30,
    min: 5,
    max: 120
  },
  frequency: {
    type: Number, // Show every X game plays
    default: 3,
    min: 1
  },

  // Monetization
  earningsPerView: {
    type: Number, // $ value per view
    default: 0.0005, // $0.50 per 1000 views
    min: 0
  },
  minPayout: {
    type: Number,
    default: 5.00 // Minimum $ amount for payout
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },

  // Analytics
  totalViews: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },

  // Game targeting
  gameTypes: [{
    type: String,
    enum: ['memory', 'dice', 'snake', 'trivia', 'wheel', 'all'],
    default: 'all'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
AdSchema.index({ network: 1, isActive: 1 });
AdSchema.index({ gameTypes: 1 });
AdSchema.index({ priority: -1 });

// Virtual for estimated earnings per 1000 views
AdSchema.virtual('cpm').get(function() {
  return (this.earningsPerView * 1000).toFixed(2);
});

// Pre-save hook to validate ad codes
AdSchema.pre('save', function(next) {
  if (this.network !== 'Custom' && !this.code) {
    throw new Error('Ad code is required for network ads');
  }
  next();
});

module.exports = mongoose.model('Ad', AdSchema);
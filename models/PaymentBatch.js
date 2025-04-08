const mongoose = require('mongoose');

const PaymentBatchSchema = new mongoose.Schema({
  batchNumber: { type: Number, required: true, unique: true },
  threshold: { type: Number, default: 1000 },
  eligibleUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  verifiedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  startTime: { type: Date, default: Date.now },
  gracePeriodEnd: Date,
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed'], 
    default: 'pending' 
  },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  processedAt: Date
});

module.exports = mongoose.model('PaymentBatch', PaymentBatchSchema);
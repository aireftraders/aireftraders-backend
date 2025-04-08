const mongoose = require('mongoose');

const WithdrawalSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true, 
    min: 5000 // ₦5000 minimum
  },
  bankDetails: {
    bankName: { 
      type: String,
      required: true
    },
    accountNumber: { 
      type: String,
      required: true
    },
    accountName: { 
      type: String,
      required: true
    }
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'rejected'],
    default: 'pending' 
  },
  batchId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'PaymentBatch' 
  },
  processedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  processedAt: { 
    type: Date 
  },
  rejectionReason: { 
    type: String 
  },
  flwReference: { 
    type: String // Flutterwave reference
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Withdrawal', WithdrawalSchema);
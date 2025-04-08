const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  gameType: { 
    type: String, 
    required: true,
    enum: ['memory', 'dice', 'snake', 'trivia', 'wheel'] 
  },
  attempts: { 
    type: Number, 
    default: 10 
  },
  attemptsUsed: { 
    type: Number, 
    default: 0 
  },
  earnings: { 
    type: Number, 
    default: 0 
  },
  lastPlayed: { 
    type: Date 
  },
  highScore: { 
    type: Number 
  }, // For games like Snake
  winStreak: { 
    type: Number, 
    default: 0 
  } // For games like Trivia
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Game', GameSchema);
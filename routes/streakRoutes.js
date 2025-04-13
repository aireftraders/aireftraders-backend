const express = require('express');
const router = express.Router();
const streakController = require('../controllers/streakController');

// Placeholder for streak routes
router.get('/', (req, res) => {
  res.send('Streak routes placeholder');
});

// Streak routes
router.post('/update', authenticate, streakController.updateLoginStreak);

module.exports = router;
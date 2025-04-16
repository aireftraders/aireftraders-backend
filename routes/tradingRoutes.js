const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const tradingController = require('../controllers/tradingController');

// Route to toggle trading
router.post('/toggle', authenticate, tradingController.toggleTrading);

// Route to activate trading
router.post('/activate', authenticate, tradingController.activateTrading);

// Route to calculate daily profit
router.post('/calculate-daily-profit', authenticate, tradingController.calculateDailyProfit);

// Route to fetch profit percentage
router.get('/profit-percentage', authenticate, tradingController.calculateProfitPercentage);

module.exports = router;
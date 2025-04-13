// routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Basic API info route
router.get('/', (req, res) => {
  res.send('AI REF-TRADERS API');
});

// Payment webhooks with signature verification
router.post('/payments/callback', webhookController.handlePaymentCallback);
router.post('/withdrawals/callback', webhookController.handleWithdrawalCallback);

module.exports = router;
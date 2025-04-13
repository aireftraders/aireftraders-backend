const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const transactionController = require('../controllers/transactionController');

router.post('/deposit', authenticate, transactionController.createDeposit);
router.post('/withdraw', authenticate, transactionController.createWithdrawal);
router.get('/', authenticate, transactionController.getUserTransactions);
router.get('/:id', authenticate, transactionController.getTransactionDetails);

module.exports = router;
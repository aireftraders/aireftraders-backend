// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const userController = require('../controllers/userController');

// Verify the controller methods exist
if (!userController.getAllUsers) throw new Error('getAllUsers controller missing');
if (!userController.getUserById) throw new Error('getUserById controller missing');

// Admin routes
router.get('/', authenticate, userController.getAllUsers);
router.get('/:id', authenticate, userController.getUserById);
router.put('/:id', authenticate, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

// User routes
router.get('/:id/transactions', authenticate, userController.getUserTransactions);
router.get('/:id/referrals', authenticate, userController.getUserReferrals);

module.exports = router;
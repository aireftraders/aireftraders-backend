const express = require('express');
const router = express.Router();
const { param, body, query } = require('express-validator');
const adminController = require('../controllers/adminController');
const validateRequest = require('../middlewares/validateRequest');

// Import and validate all middleware functions
const authMiddlewares = require('../middlewares/auth');

// Verify all middleware exists before using them
const { 
  verifyTelegramAuth, 
  ensureAdmin,
  authenticate,
  isAdmin 
} = authMiddlewares;

if (!verifyTelegramAuth || !ensureAdmin || !authenticate || !isAdmin) {
  throw new Error('One or more admin middleware functions are missing');
}

// Universal Admin Middleware Stack with error handling
const adminMiddlewareStack = [
  (req, res, next) => {
    verifyTelegramAuth(req, res, (err) => {
      if (err) return res.status(401).json({ error: 'Telegram auth failed' });
      next();
    });
  },
  (req, res, next) => {
    ensureAdmin(req, res, (err) => {
      if (err) return res.status(403).json({ error: 'Admin access required' });
      next();
    });
  },
  authenticate,
  isAdmin
];

router.use(adminMiddlewareStack);

// ========================
// Dashboard Routes
// ========================
router.get('/dashboard', 
  query('timeframe').optional().isIn(['day', 'week', 'month'])
    .withMessage('Timeframe must be day, week, or month'),
  validateRequest,
  adminController.getDashboardStats
);

// ========================
// Withdrawal Management
// ========================
router.post('/withdrawals/process/:batchId',
  param('batchId').isMongoId().withMessage('Invalid batch ID format'),
  validateRequest,
  adminController.processBatchWithdrawals
);

router.post('/payouts',
  body('batchIds').isArray({ min: 1 })
    .withMessage('At least one batch ID is required'),
  body('batchIds.*').isMongoId()
    .withMessage('Invalid batch ID format in array'),
  validateRequest,
  adminController.processBatchPayouts
);

// ========================
// Threshold Management
// ========================
router.put('/threshold/override',
  body('newThreshold').isFloat({ min: 0.01 })
    .withMessage('Threshold must be a number greater than 0.01'),
  body('reason').isString().trim().notEmpty()
    .withMessage('Reason is required'),
  validateRequest,
  adminController.overrideThreshold
);

// ========================
// User Management
// ========================
router.put('/users/:id/verify',
  param('id').isMongoId().withMessage('Invalid user ID format'),
  body('status').isIn(['verified', 'rejected'])
    .withMessage('Status must be either verified or rejected'),
  body('notes').optional().isString().trim(),
  validateRequest,
  adminController.verifyUser
);

router.put('/grace-period/extend/:batchId',
  param('batchId').isMongoId().withMessage('Invalid batch ID format'),
  body('days').isInt({ min: 1, max: 30 })
    .withMessage('Days must be between 1 and 30'),
  body('reason').optional().isString().trim(),
  validateRequest,
  adminController.extendGracePeriod
);

// ========================
// Announcement Management
// ========================
router.post('/announcements',
  body('title').isString().trim().isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5-100 characters'),
  body('content').isString().trim().isLength({ min: 10, max: 1000 })
    .withMessage('Content must be between 10-1000 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('targetGroups').optional().isArray(),
  body('targetGroups.*').optional().isString(),
  validateRequest,
  adminController.createAnnouncement
);

router.post('/announcements/send/:id',
  param('id').isMongoId().withMessage('Invalid announcement ID format'),
  body('channels').isArray({ min: 1 })
    .withMessage('At least one channel is required'),
  body('channels.*').isIn(['email', 'push', 'in-app'])
    .withMessage('Invalid channel type'),
  validateRequest,
  adminController.sendAnnouncement
);

module.exports = router;
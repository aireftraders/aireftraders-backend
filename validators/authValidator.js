const { body } = require('express-validator');

exports.registerValidator = [
  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
    
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number'),
    
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match')
];

// Then in authRoutes.js:
const { registerValidator } = require('../validators/authValidator');
router.post('/register', registerValidator, authController.register);
// Add admin check to your existing auth middleware
exports.adminCheck = (req, res, next) => {
  console.log('Admin check middleware triggered');
  if (!req.user?.isAdmin) {
    console.warn('Admin access denied for user:', req.user?.email || 'Unknown');
    return res.status(403).json({ message: "Admin access required" });
  }
  console.log('Admin access granted for user:', req.user.email);
  next();
};
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Authorization Header:', req.header('Authorization'));
  console.log('Extracted Token:', token);

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token Verification Error:', error.message);
    res.status(400).json({ error: 'Invalid token' });
  }
};
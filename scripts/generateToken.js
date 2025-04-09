const jwt = require('jsonwebtoken');
console.log('Loading .env file...');
const dotenvResult = require('dotenv').config();
console.log('dotenv result:', dotenvResult);

console.log('JWT_SECRET:', process.env.JWT_SECRET);

try {
  const token = jwt.sign({ _id: 'testUserId' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('Generated JWT Token:', token);
} catch (error) {
  console.error('Error generating token:', error.message);
}
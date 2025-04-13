const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

(async () => {
  try {
    const testUser = new User({
      email: 'testuser@example.com',
      password: 'password123', // This will be hashed by the pre-save hook
      name: 'Test User',
      isVerified: true
    });

    await testUser.save();
    console.log('Test user created successfully:', testUser._id);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    mongoose.connection.close();
  }
})();
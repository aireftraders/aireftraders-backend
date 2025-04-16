// controllers/userController.js
const User = require('../models/User');

// Make sure all methods are properly exported
module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Add all other methods referenced in your routes
  updateUser: async (req, res) => { /* implementation */ },
  deleteUser: async (req, res) => { /* implementation */ },

  // Add missing methods to avoid undefined errors
  getUserTransactions: async (req, res) => {
    try {
      // Placeholder implementation
      res.json({ message: 'User transactions fetched successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getUserReferrals: async (req, res) => {
    try {
      // Placeholder implementation
      res.json({ message: 'User referrals fetched successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getUserProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const newUser = new User({ username, email, password });
      await newUser.save();

      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Assuming a method to validate password exists
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate a token (assuming a method exists)
      const token = user.generateAuthToken();

      res.json({ message: 'Login successful', token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getUserBalanceAndCapital: async (req, res) => {
    try {
      const userId = req.user._id;

      // Fetch user data
      const user = await User.findById(userId, 'balance tradingCapital');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      res.json({ success: true, balance: user.balance, tradingCapital: user.tradingCapital });
    } catch (error) {
      console.error('Error fetching user balance and capital:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },
};
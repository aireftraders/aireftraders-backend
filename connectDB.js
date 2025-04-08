const mongoose = require('mongoose'); // Correct import for mongoose

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, // Corrected typo
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1); // Corrected undefined exit function
  }
};

module.exports = connectDB;


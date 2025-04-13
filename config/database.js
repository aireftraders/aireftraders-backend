const mongoose = require('mongoose');

// Suppress Mongoose strictQuery deprecation warning
mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');

    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/airef-traders';
    console.log('Using URI:', process.env.MONGODB_URI ? 'Found in .env' : 'Not found! Using local fallback');

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
    });

    console.log(`✅ MongoDB Connected to: ${mongoose.connection.host}`);
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
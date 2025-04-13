const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

(async () => {
  try {
    const user = await User.findOne(); // Fetch the first user in the database
    if (user) {
      console.log('Valid User ID:', user._id);
    } else {
      console.log('No users found in the database.');
    }
  } catch (error) {
    console.error('Error querying User collection:', error);
  } finally {
    mongoose.connection.close();
  }
})();
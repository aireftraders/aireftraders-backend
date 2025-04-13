require('dotenv').config();
const mongoose = require('mongoose');
const Bank = require('../models/Bank');
const User = require('../models/User');
const Ad = require('../models/Ad');

const nigerianBanks = [
  { name: 'Access Bank', code: '044' },
  // ... (your full bank list)
];

const sampleAds = [
  {
    title: 'Special Offer',
    network: 'Adsterra',
    code: 'ADST-12345',
    duration: 15,
    earningsPerView: 0.001,
    gameTypes: ['memory', 'dice']
  },
  {
    title: 'In-House Promotion',
    network: 'Custom',
    content: 'Check out our new features!',
    duration: 20
  },
  {
    title: 'Premium Content',
    network: 'Adsense',
    code: 'ADS-56789',
    duration: 30,
    earningsPerView: 0.002,
    gameTypes: ['all']
  },
  {
    title: 'Crypto Bonus',
    network: 'Cointzilla',
    code: 'CNTZ-9876',
    duration: 25,
    earningsPerView: 0.0015,
    gameTypes: ['wheel', 'trivia']
  }
];

async function initializeDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('Connected to MongoDB');

    // Clear existing data (optional)
    await mongoose.connection.db.dropDatabase();
    console.log('Cleared existing database');

    // Insert banks
    await Bank.insertMany(nigerianBanks);
    console.log(`Inserted ${nigerianBanks.length} banks`);

    // Insert sample ads
    await Ad.insertMany(sampleAds);
    console.log(`Inserted ${sampleAds.length} sample ads`);

    // Create admin user
    const admin = await User.create({
      email: 'admin@aireftraders.com',
      password: 'secureAdminPassword123',
      name: 'Admin User',
      telegramId: process.env.ADMIN_TELEGRAM_ID,
      firstName: 'Admin',
      isAdmin: true,
      isVerified: true,
      verificationFeePaid: true,
      balance: 100000,
      bankDetails: {
        bankName: 'Access Bank',
        accountNumber: '0000000000',
        accountName: 'Admin Account',
        verified: true
      }
    });
    console.log('Admin user created:', admin);

    console.log('✅ Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Initialization failed:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
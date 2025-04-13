const mongoose = require('mongoose');
const Ad = require('../models/Ad');
const connectDB = require('../config/database');

const seedDatabase = async () => {
  await connectDB();

  console.log('Seeding database...');
  await Ad.deleteMany(); // Clear existing data

  const ads = [
    { title: 'Memory Game Ad', gameTypes: ['memory'], views: 0 },
    { title: 'Puzzle Game Ad', gameTypes: ['puzzle'], views: 0 },
    { title: 'Adventure Game Ad', gameTypes: ['adventure'], views: 0 },
    { title: 'Strategy Game Ad', gameTypes: ['strategy'], views: 0 },
    { title: 'Action Game Ad', gameTypes: ['action'], views: 0 },
  ];

  await Ad.insertMany(ads);
  console.log('Database seeded successfully!');
  process.exit();
};

seedDatabase();

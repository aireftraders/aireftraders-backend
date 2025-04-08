const Ad = require('../models/Ad');

const adNetworks = [
  {
    network: "Adsterra",
    code: "ADST",
    description: "Premium ad network with high-paying ads",
    frequency: 2,
    earningsPerView: 0.75
  },
  {
    network: "Monetag",
    code: "MNTG",
    description: "High-converting video ads",
    frequency: 3,
    earningsPerView: 0.60
  },
  {
    network: "Cointzilla",
    code: "CNTZ",
    description: "Crypto-focused ad network",
    frequency: 1,
    earningsPerView: 0.55
  }
];

async function initializeAds() {
  try {
    const count = await Ad.countDocuments();
    if (count === 0) {
      await Ad.insertMany(adNetworks);
      console.log('Ad networks initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing ads:', error);
  }
}

module.exports = initializeAds;
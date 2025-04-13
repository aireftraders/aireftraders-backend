const Ad = require('../models/Ad');

const ads = [
  {
    network: "Adsterra",
    link: "https://innumerablemakeupreligious.com/mtkt19h3s?key=4e6c81f7385a8bacf3617fadee0ded8f",
    gameTypes: ["memory", "dice"]
  },
  {
    network: "Monetag",
    link: "https://whoockeg.top/4/9191531",
    gameTypes: ["snake", "trivia"]
  },
  {
    network: "Cointzilla",
    code: "CNTZ",
    description: "Crypto-focused ad network",
    frequency: 1,
    earningsPerView: 0.55,
    gameTypes: ["all"]
  }
];

async function initializeAds() {
  try {
    const count = await Ad.countDocuments();
    if (count === 0) {
      await Ad.insertMany(ads);
      console.log('Ad networks initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing ads:', error);
  }
}

module.exports = initializeAds;
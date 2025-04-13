// models/Ad.js
const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: String,
  gameTypes: [String],
  views: { type: Number, default: 0 },
});

module.exports = mongoose.model('Ad', adSchema);
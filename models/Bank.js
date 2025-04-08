const mongoose = require('mongoose');

const BankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  country: { type: String, default: 'Nigeria' }
});

module.exports = mongoose.model('Bank', BankSchema);
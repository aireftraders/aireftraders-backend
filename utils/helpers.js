const PaymentBatch = require('../models/PaymentBatch');

function calculateGracePeriod() {
  const now = new Date();
  const nigeriaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Lagos' }));
  const hours = nigeriaTime.getHours();
  
  return hours >= 10 && hours < 19 ? 6 : 10;
}

async function getNextBatchNumber() {
  const lastBatch = await PaymentBatch.findOne().sort('-batchNumber');
  return lastBatch ? lastBatch.batchNumber + 1 : 1;
}

module.exports = {
  calculateGracePeriod,
  getNextBatchNumber
};
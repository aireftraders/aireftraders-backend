const PaymentBatch = require('../models/PaymentBatch');
const Ad = require('../models/Ad');

// Function to calculate batch earnings
async function calculateBatchEarnings(batch) {
  const adEarnings = await Ad.aggregate([
    {
      $match: { active: true }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$earnings' }
      }
    }
  ]);

  return adEarnings.length > 0 ? adEarnings[0].total : 0;
}

// Function to check and process payment batches
exports.checkBatches = async () => {
  try {
    console.log('Starting batch monitoring...');

    // Fetch all pending payment batches
    const pendingBatches = await PaymentBatch.find({ status: 'pending' });

    for (const batch of pendingBatches) {
      const earnings = await calculateBatchEarnings(batch);

      // Update batch with calculated earnings
      batch.earnings = earnings;
      batch.status = 'processed';
      await batch.save();

      console.log(`Batch ${batch._id} processed with earnings: ${earnings}`);
    }

    console.log('Batch monitoring completed.');
  } catch (error) {
    console.error('Error in batch monitoring:', error);
  }
};

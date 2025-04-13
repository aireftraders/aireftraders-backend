const PaymentBatch = require('../models/PaymentBatch');
const Ad = require('../models/Ad');

// Function to calculate batch earnings
async function calculateBatchEarnings(batch) {
  try {
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
  } catch (error) {
    console.error(`Error calculating earnings for batch ${batch._id}:`, error);
    return 0; // Return 0 earnings in case of an error
  }
}

// Function to check and process payment batches
exports.checkBatches = async () => {
  try {
    console.log('Starting batch monitoring...');

    // Fetch all pending payment batches
    const pendingBatches = await PaymentBatch.find({ status: 'pending' });

    for (const batch of pendingBatches) {
      try {
        console.log(`Processing batch ${batch._id}...`);

        const earnings = await calculateBatchEarnings(batch);

        // Update batch with calculated earnings
        batch.earnings = earnings;
        batch.status = 'processed';
        await batch.save();

        console.log(`Batch ${batch._id} processed successfully with earnings: ${earnings}`);
      } catch (batchError) {
        console.error(`Error processing batch ${batch._id}:`, batchError);
        // Log the error and continue with the next batch
      }
    }

    console.log('Batch monitoring completed.');
  } catch (error) {
    console.error('Critical error in batch monitoring:', error);
  }
};

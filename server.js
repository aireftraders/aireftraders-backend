// server.js
require('dotenv').config();
const cron = require('node-cron'); // Only declare ONCE at the top
const app = require('./app');
const PORT = process.env.PORT || 5000;

// Scheduled Tasks
cron.schedule('0 0 * * *', () => {
  console.log('Running daily streak check...');
  require('./services/streakService').checkStreaks();
});

cron.schedule('*/5 * * * *', () => {
  console.log('Checking payment batches...');
  require('./services/batchMonitor').checkBatches();
});

// Server Initialization
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Error Handlers
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});
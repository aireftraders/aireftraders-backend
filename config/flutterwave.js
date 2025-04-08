const flw = require('flutterwave-node-v3');
if (!process.env.FLW_PUBLIC_KEY || !process.env.FLW_SECRET_KEY) {
  throw new Error('Flutterwave API keys are missing');
}
const flutterwave = new flw(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY,
);

module.exports = flutterwave;
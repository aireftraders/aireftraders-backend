const flw = require('flutterwave-node-v3');

if (!process.env.FLW_PUBLIC_KEY || !process.env.FLW_SECRET_KEY) {
  throw new Error('Flutterwave API keys are missing. Please set FLW_PUBLIC_KEY and FLW_SECRET_KEY in your environment variables.');
}

let flutterwave;

try {
  flutterwave = new flw(
    process.env.FLW_PUBLIC_KEY,
    process.env.FLW_SECRET_KEY,
  );
} catch (error) {
  throw new Error(`Failed to initialize Flutterwave: ${error.message}`);
}

module.exports = flutterwave;

const flutterwave = require('../config/flutterwave');

exports.processPayment = async ({ userId, amount, description }) => {
  try {
    const payload = {
      tx_ref: `tx-${Date.now()}-${userId}`,
      amount: amount.toString(),
      currency: 'NGN',
      payment_options: 'card,account,ussd',
      redirect_url: process.env.FLW_CALLBACK_URL,
      customer: {
        email: `${userId}@aireftraders.ng`,
        phonenumber: 'N/A',
        name: 'AI REF-TRADERS User'
      },
      customizations: {
        title: 'AI REF-TRADERS',
        description,
        logo: 'https://aireftraders.ng/logo.png'
      }
    };
    
    const response = await flutterwave.Payment.card(payload);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

exports.verifyBankAccount = async (details) => {
  try {
    const response = await flutterwave.Misc.verify_Account(details);
    return { status: 'success', data: response.data };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
};

exports.processBatchWithdrawals = async (batchId) => {
  try {
    // Implementation for batch withdrawals
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
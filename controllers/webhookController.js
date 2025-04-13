exports.handlePayment = (req, res) => {
    const secretHash = process.env.FLW_SECRET_HASH;
    if (req.headers['verif-hash'] !== secretHash) {
      return res.status(401).send('Unauthorized');
    }
    // Process payment webhook
    res.status(200).send('Webhook received');
  };
  
  exports.handleWithdrawal = (req, res) => {
    const secretHash = process.env.FLW_SECRET_HASH;
    if (req.headers['verif-hash'] !== secretHash) {
      return res.status(401).send('Unauthorized');
    }
    // Process withdrawal webhook
    res.status(200).send('Webhook received');
  };
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('AI REF-TRADERS API');
});

module.exports = router;
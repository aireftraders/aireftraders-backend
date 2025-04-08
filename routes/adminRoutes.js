const express = require('express');
const router = express.Router();
const { verifyTelegramAuth, ensureAdmin } = require('../middlewares/telegramAuth');
const {
  processBatchWithdrawals,
  overrideThreshold,
  extendGracePeriod,
  sendAnnouncement
} = require('../controllers/adminController');

router.use(verifyTelegramAuth, ensureAdmin);

router.post('/withdrawals/process/:batchId', processBatchWithdrawals);
router.put('/threshold/override', overrideThreshold);
router.put('/grace-period/extend/:batchId', extendGracePeriod);
router.post('/announcements', sendAnnouncement);

module.exports = router;
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const gameController = require('../controllers/gameController');

router.post('/memory', authenticate, gameController.playMemoryGame);
router.post('/dice', authenticate, gameController.playDiceGame);
router.post('/wheel', authenticate, gameController.spinWheel);
router.get('/history', authenticate, gameController.getGameHistory);

module.exports = router;
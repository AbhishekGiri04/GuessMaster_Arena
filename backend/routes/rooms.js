const express = require('express');
const { protect } = require('../middlewares/auth');
const { getRooms, createRoom, joinRoom } = require('../controllers/game');

const router = express.Router();

router.get('/rooms', protect, getRooms);
router.post('/create', protect, createRoom);
router.post('/join/:roomId', protect, joinRoom);

module.exports = router;
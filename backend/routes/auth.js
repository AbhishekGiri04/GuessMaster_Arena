const express = require('express');
const passport = require('passport');
const { register, login, getProfile, googleAuth, googleCallback } = require('../controllers/auth');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

module.exports = router;
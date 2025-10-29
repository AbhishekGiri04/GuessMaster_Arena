const express = require('express');
const { protect } = require('../middlewares/auth');
const User = require('../models/User');

const router = express.Router();

// Get user game stats
router.get('/stats', protect, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      gamesPlayed: user.stats.gamesPlayed,
      gamesWon: user.stats.gamesWon,
      totalScore: user.stats.totalScore,
      winRate: user.stats.winRate,
      level: user.stats.level || 1,
      achievements: user.stats.achievements || {
        firstVictory: false,
        levelUp: false,
        multiplayerMaster: false,
        champion: false
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find({})
      .select('username stats')
      .sort({ 'stats.totalScore': -1, 'stats.gamesWon': -1 })
      .limit(10);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
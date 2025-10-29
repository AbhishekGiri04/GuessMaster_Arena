// Scoring utility functions

const calculateScore = (guesses, timeElapsed, isWinner) => {
  if (!isWinner) return 0;
  
  const baseScore = 100;
  const guessBonus = Math.max(0, 50 - (guesses * 5)); // Fewer guesses = higher bonus
  const timeBonus = Math.max(0, 30 - Math.floor(timeElapsed / 1000)); // Faster = higher bonus
  
  return baseScore + guessBonus + timeBonus;
};

const updateUserStats = async (user, gameResult) => {
  user.stats.gamesPlayed += 1;
  
  if (gameResult.isWinner) {
    user.stats.gamesWon += 1;
    user.stats.totalScore += gameResult.score;
    
    // First victory achievement
    if (user.stats.gamesWon === 1) {
      user.stats.achievements.firstVictory = true;
    }
    
    // Multiplayer master achievement (5 wins)
    if (user.stats.gamesWon === 5) {
      user.stats.achievements.multiplayerMaster = true;
    }
    
    // Champion achievement (10 wins)
    if (user.stats.gamesWon === 10) {
      user.stats.achievements.champion = true;
    }
  }
  
  // Calculate win rate
  user.stats.winRate = (user.stats.gamesWon / user.stats.gamesPlayed) * 100;
  
  // Level progression (every 10 games)
  const newLevel = Math.floor(user.stats.gamesPlayed / 10) + 1;
  if (newLevel > user.stats.level) {
    user.stats.level = newLevel;
    if (user.stats.level >= 5) {
      user.stats.achievements.levelUp = true;
    }
  }
  
  await user.save();
  return user.stats;
};

const getLeaderboard = async () => {
  const User = require('../models/User');
  return await User.find({})
    .select('username stats')
    .sort({ 'stats.totalScore': -1, 'stats.gamesWon': -1 })
    .limit(10);
};

module.exports = {
  calculateScore,
  updateUserStats,
  getLeaderboard
};
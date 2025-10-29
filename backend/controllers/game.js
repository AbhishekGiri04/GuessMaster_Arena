const GameRoom = require('../models/GameRoom');
const User = require('../models/User');
const { calculateScore, updateUserStats, getLeaderboard } = require('../utils/scoring');

const createRoom = async (req, res) => {
  try {
    const { name, isPrivate, password, maxPlayers } = req.body;
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const targetNumber = Math.floor(Math.random() * 100) + 1;
    
    const room = new GameRoom({
      roomId,
      name,
      isPrivate,
      password,
      maxPlayers,
      currentNumber: targetNumber,
      players: [{
        userId: req.user._id,
        username: req.user.username,
        score: 0,
        guesses: []
      }]
    });
    
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await GameRoom.find({ 
      isPrivate: false, 
      gameState: 'waiting' 
    }).select('roomId name players maxPlayers');
    
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await GameRoom.findOne({ roomId });
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    if (room.players.length >= room.maxPlayers) {
      return res.status(400).json({ message: 'Room is full' });
    }
    
    room.players.push({
      userId: req.user._id,
      username: req.user.username,
      score: 0,
      guesses: []
    });
    
    await room.save();
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('stats');
    res.json(user.stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeaderboardData = async (req, res) => {
  try {
    const leaderboard = await getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRoom,
  getRooms,
  joinRoom,
  getStats,
  getLeaderboardData
};
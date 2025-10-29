const mongoose = require('mongoose');

const gameRoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  isPrivate: { type: Boolean, default: false },
  password: String,
  maxPlayers: { type: Number, default: 4 },
  currentNumber: { type: Number, min: 1, max: 100 },
  gameState: { 
    type: String, 
    enum: ['waiting', 'playing', 'finished'], 
    default: 'waiting' 
  },
  players: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String,
    score: { type: Number, default: 0 },
    guesses: [Number],
    isReady: { type: Boolean, default: false }
  }],
  spectators: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: String
  }],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  roundStartTime: Date,
  roundDuration: { type: Number, default: 60000 } // 60 seconds
}, { timestamps: true });

module.exports = mongoose.model('GameRoom', gameRoomSchema);
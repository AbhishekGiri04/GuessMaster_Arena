const GameRoom = require('../models/GameRoom');
const User = require('../models/User');
const AIOpponent = require('../utils/ai');
const { calculateScore, updateUserStats } = require('../utils/scoring');

const aiGames = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Single player game
    socket.on('start-single-player', (data) => {
      try {
        const { userId, username } = data || {};
        const targetNumber = Math.floor(Math.random() * 100) + 1;
        const ai = new AIOpponent();
        ai.setDifficulty('medium'); // Set default difficulty
        
        const gameState = {
          targetNumber,
          ai,
          playerGuesses: [],
          aiGuesses: [],
          gameStartTime: Date.now(),
          isFinished: false,
          userId,
          username: username || 'Guest'
        };
        
        aiGames.set(socket.id, gameState);
        console.log(`AI game started for ${username || 'Guest'}, target: ${targetNumber}`);
        socket.emit('game-started', { gameId: socket.id, message: 'Game started! Make your first guess.' });
      } catch (error) {
        console.error('Error starting single player game:', error);
        socket.emit('error', { message: 'Failed to start game' });
      }
    });

    socket.on('player-guess', (data) => {
      try {
        const { guess } = data || {};
        const gameState = aiGames.get(socket.id);
        
        if (!gameState || gameState.isFinished) {
          socket.emit('error', { message: 'No active game found' });
          return;
        }
        
        if (!guess || guess < 1 || guess > 100) {
          socket.emit('error', { message: 'Invalid guess. Please enter a number between 1-100' });
          return;
        }
        
        gameState.playerGuesses.push(guess);
        console.log(`Player guess: ${guess}, target: ${gameState.targetNumber}`);
        
        if (guess === gameState.targetNumber) {
          gameState.isFinished = true;
          console.log('Player won!');
          
          // Update user stats for win
          if (gameState.userId) {
            User.findById(gameState.userId).then(user => {
              if (user) {
                const score = calculateScore(gameState.playerGuesses.length, Date.now() - gameState.gameStartTime, true);
                updateUserStats(user, { isWinner: true, score }).catch(console.error);
              }
            }).catch(console.error);
          }
          
          socket.emit('game-over', { 
            winner: 'player', 
            targetNumber: gameState.targetNumber,
            playerGuesses: gameState.playerGuesses.length,
            aiGuesses: gameState.aiGuesses.length
          });
          aiGames.delete(socket.id);
          return;
        }
        
        const hint = guess < gameState.targetNumber ? 'higher' : 'lower';
        socket.emit('guess-result', { guess, hint, player: 'human' });
        
        // AI makes a guess after a delay
        const aiDelay = 1500 + Math.random() * 1500; // 1.5-3 seconds
        setTimeout(() => {
          if (gameState.isFinished || !aiGames.has(socket.id)) return;
          
          const aiGuess = gameState.ai.makeGuess();
          gameState.aiGuesses.push(aiGuess);
          console.log(`AI guess: ${aiGuess}, target: ${gameState.targetNumber}`);
          
          if (aiGuess === gameState.targetNumber) {
            gameState.isFinished = true;
            console.log('AI won!');
            
            // Update user stats for loss
            if (gameState.userId) {
              User.findById(gameState.userId).then(user => {
                if (user) {
                  updateUserStats(user, { isWinner: false, score: 0 }).catch(console.error);
                }
              }).catch(console.error);
            }
            
            socket.emit('game-over', { 
              winner: 'ai', 
              targetNumber: gameState.targetNumber,
              playerGuesses: gameState.playerGuesses.length,
              aiGuesses: gameState.aiGuesses.length
            });
            aiGames.delete(socket.id);
            return;
          }
          
          const aiHint = aiGuess < gameState.targetNumber ? 'higher' : 'lower';
          gameState.ai.processHint(aiGuess, aiHint);
          socket.emit('guess-result', { guess: aiGuess, hint: aiHint, player: 'ai' });
        }, aiDelay);
      } catch (error) {
        console.error('Error processing player guess:', error);
        socket.emit('error', { message: 'Failed to process guess' });
      }
    });

    // Room management
    socket.on('create-room', async (data) => {
      const { name, isPrivate, password, maxPlayers, userId, username } = data;
      
      try {
        const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const targetNumber = Math.floor(Math.random() * 100) + 1;
        
        const room = new GameRoom({
          roomId,
          name,
          isPrivate,
          password,
          maxPlayers,
          currentNumber: targetNumber,
          players: [{ userId, username, score: 0, guesses: [] }]
        });
        
        await room.save();
        socket.join(roomId);
        socket.emit('room-created', { room });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('get-public-rooms', async () => {
      try {
        const rooms = await GameRoom.find({ 
          isPrivate: false, 
          gameState: 'waiting' 
        }).select('roomId name players maxPlayers');
        
        socket.emit('public-rooms', { rooms });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('start-game', async (data) => {
      const { roomId } = data;
      
      try {
        const room = await GameRoom.findOne({ roomId });
        if (!room) return;
        
        room.gameState = 'playing';
        room.roundStartTime = new Date();
        await room.save();
        
        io.to(roomId).emit('game-started', { 
          message: 'Game started! Guess the number between 1-100' 
        });
        
        setTimeout(async () => {
          const updatedRoom = await GameRoom.findOne({ roomId });
          if (updatedRoom && updatedRoom.gameState === 'playing') {
            updatedRoom.gameState = 'finished';
            await updatedRoom.save();
            io.to(roomId).emit('game-timeout', { 
              targetNumber: updatedRoom.currentNumber 
            });
          }
        }, room.roundDuration);
        
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('join-room', async (data) => {
      const { roomId, userId, username } = data;
      
      try {
        let room = await GameRoom.findOne({ roomId });
        if (!room) {
          return socket.emit('error', { message: 'Room not found' });
        }
        
        if (room.players.length >= room.maxPlayers) {
          // Join as spectator
          room.spectators.push({ userId, username });
          await room.save();
          socket.join(roomId);
          socket.emit('joined-as-spectator', { room });
        } else {
          // Join as player
          room.players.push({ userId, username, score: 0, guesses: [] });
          await room.save();
          socket.join(roomId);
          socket.emit('joined-room', { room });
          socket.to(roomId).emit('player-joined', { username, room });
        }
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('multiplayer-guess', async (data) => {
      const { roomId, guess, userId } = data;
      
      try {
        const room = await GameRoom.findOne({ roomId });
        if (!room || room.gameState !== 'playing') return;
        
        const player = room.players.find(p => p.userId.toString() === userId);
        if (!player) return;
        
        player.guesses.push(guess);
        
        if (guess === room.currentNumber) {
          room.winner = userId;
          room.gameState = 'finished';
          const score = calculateScore(player.guesses.length, Date.now() - room.roundStartTime, true);
          player.score += score;
          await room.save();
          
          // Update winner stats
          User.findById(userId).then(user => {
            if (user) {
              updateUserStats(user, { isWinner: true, score }).catch(console.error);
            }
          }).catch(console.error);
          
          // Update other players as losers
          for (const p of room.players) {
            if (p.userId.toString() !== userId) {
              User.findById(p.userId).then(user => {
                if (user) {
                  updateUserStats(user, { isWinner: false, score: 0 }).catch(console.error);
                }
              }).catch(console.error);
            }
          }
          
          io.to(roomId).emit('game-over', { 
            winner: player.username, 
            targetNumber: room.currentNumber 
          });
        } else {
          const hint = guess < room.currentNumber ? 'higher' : 'lower';
          await room.save();
          
          io.to(roomId).emit('guess-made', { 
            username: player.username, 
            guess, 
            hint 
          });
        }
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      aiGames.delete(socket.id);
    });
  });
};
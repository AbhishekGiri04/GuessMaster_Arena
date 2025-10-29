import React, { useState, useEffect } from 'react';
import { useGame } from '../context/Game';
import { useAuth } from '../context/Auth';
import { useTheme } from '../context/Theme';
import { Link } from 'react-router-dom';

const AnimatedBackground = () => (
  <div className="bg-animation">
    <div className="floating-shapes">
      <div className="shape"></div>
      <div className="shape"></div>
      <div className="shape"></div>
      <div className="shape"></div>
      <div className="shape"></div>
    </div>
  </div>
);

const Multiplayer = () => {
  const { socket, connectSocket, disconnectSocket } = useGame();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [gameState, setGameState] = useState('lobby');
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [gameResult, setGameResult] = useState(null);
  const [roomForm, setRoomForm] = useState({ name: '', password: '' });

  useEffect(() => {
    const gameSocket = connectSocket();

    gameSocket.on('public-rooms', (data) => {
      setRooms(data.rooms);
    });

    gameSocket.on('room-created', (data) => {
      setCurrentRoom(data.room);
      setGameState('room');
    });

    gameSocket.on('joined-room', (data) => {
      setCurrentRoom(data.room);
      setGameState('room');
    });

    gameSocket.on('joined-as-spectator', (data) => {
      setCurrentRoom(data.room);
      setGameState('spectator');
    });

    gameSocket.on('game-started', () => {
      // Check if user is spectator or player
      const isSpectator = gameState === 'spectator';
      setGameState(isSpectator ? 'spectating-game' : 'playing');
      setGuesses([]);
      setGameResult(null);
    });

    gameSocket.on('guess-made', (data) => {
      setGuesses(prev => [...prev, data]);
    });

    gameSocket.on('game-over', (data) => {
      setGameState('finished');
      setGameResult(data);
    });

    gameSocket.on('game-timeout', (data) => {
      setGameState('finished');
      setGameResult({ winner: 'Time Up!', targetNumber: data.targetNumber });
    });

    // Initialize empty rooms
    setRooms([]);

    return () => {
      disconnectSocket();
    };
  }, []);

  const createRoom = () => {
    if (!roomForm.name.trim()) return;
    
    const newRoom = {
      roomId: Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase(),
      name: roomForm.name,
      password: roomForm.password,
      players: [{ username: user?.username || 'Player', userId: user?.email || Date.now().toString() }],
      maxPlayers: 4,
      isPrivate: !!roomForm.password
    };
    
    setRooms([...rooms, newRoom]);
    setCurrentRoom(newRoom);
    setGameState('room');
    setRoomForm({ name: '', password: '' });
    
    // Add activity for creating room
    if (user) {
      const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
      const newActivity = {
        type: 'Room Created',
        description: `Created multiplayer room "${roomForm.name}"`,
        timestamp: new Date().toISOString(),
        icon: 'ROOM'
      };
      activities.unshift(newActivity);
      localStorage.setItem('userActivities', JSON.stringify(activities.slice(0, 10)));
    }
  };

  const joinRoom = (roomId) => {
    // Demo room joining
    const room = rooms.find(r => r.roomId === roomId);
    if (room && room.players.length < room.maxPlayers) {
      const updatedRoom = {
        ...room,
        players: [...room.players, { username: user?.username || 'Player', userId: user?.email || Date.now().toString() }]
      };
      setCurrentRoom(updatedRoom);
      setGameState('room');
      
      // Update rooms list
      setRooms(rooms.map(r => r.roomId === roomId ? updatedRoom : r));
      
      // Add activity for joining room
      if (user) {
        const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
        const newActivity = {
          type: 'Joined Room',
          description: `Joined multiplayer room "${room.name}"`,
          timestamp: new Date().toISOString(),
          icon: 'JOIN'
        };
        activities.unshift(newActivity);
        localStorage.setItem('userActivities', JSON.stringify(activities.slice(0, 10)));
      }
    }
  };

  const startGame = () => {
    if (socket && currentRoom) {
      socket.emit('start-game', { roomId: currentRoom.roomId });
      
      // Add activity for starting multiplayer game
      if (user) {
        const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
        const newActivity = {
          type: 'Multiplayer Battle Started',
          description: `Started multiplayer battle in "${currentRoom.name}"`,
          timestamp: new Date().toISOString(),
          icon: 'BATTLE'
        };
        activities.unshift(newActivity);
        localStorage.setItem('userActivities', JSON.stringify(activities.slice(0, 10)));
      }
    }
  };

  const makeGuess = (e) => {
    e.preventDefault();
    const guessNum = parseInt(guess);
    if (guessNum >= 1 && guessNum <= 100 && socket && user) {
      socket.emit('multiplayer-guess', {
        roomId: currentRoom.roomId,
        guess: guessNum,
        userId: user._id
      });
      setGuess('');
    }
  };

  if (!user) {
    return (
      <div className={`multiplayer ${!isDark ? 'light-theme' : ''}`}>
        <AnimatedBackground />
        <div className="game-container">
          <div className="arena-auth-container">
            <div className="arena-bg-effects">
              <div className="cyber-grid"></div>
              <div className="energy-orbs">
                <div className="energy-orb orb-1"></div>
                <div className="energy-orb orb-2"></div>
                <div className="energy-orb orb-3"></div>
                <div className="energy-orb orb-4"></div>
                <div className="energy-orb orb-5"></div>
              </div>
              <div className="plasma-waves">
                <div className="plasma-wave wave-1"></div>
                <div className="plasma-wave wave-2"></div>
                <div className="plasma-wave wave-3"></div>
              </div>
              <div className="holographic-elements">
                <div className="holo-ring ring-1"></div>
                <div className="holo-ring ring-2"></div>
                <div className="holo-ring ring-3"></div>
              </div>
              <div className="particle-system">
                <div className="particle p-1"></div>
                <div className="particle p-2"></div>
                <div className="particle p-3"></div>
                <div className="particle p-4"></div>
                <div className="particle p-5"></div>
                <div className="particle p-6"></div>
              </div>
            </div>
            
            <div className="arena-hero">
              <div className="arena-logo">
                <div className="logo-ring">
                  <div className="logo-core">
                    <svg width="80" height="80" viewBox="0 0 24 24" className="arena-icon">
                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" fill="url(#arenaGradient)"/>
                      <defs>
                        <linearGradient id="arenaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ff6b35" />
                          <stop offset="50%" stopColor="#f093fb" />
                          <stop offset="100%" stopColor="#00ffff" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="logo-pulse-rings">
                    <div className="pulse-ring pr-1"></div>
                    <div className="pulse-ring pr-2"></div>
                    <div className="pulse-ring pr-3"></div>
                  </div>
                </div>
              </div>
              
              <h1 className="arena-title">
                <span className="title-word">Join</span>
                <span className="title-word">the</span>
                <span className="title-word">Arena</span>
              </h1>
              <p className="arena-subtitle">
                <span className="subtitle-highlight">Sign in with Google</span> to compete with players worldwide in 
                <span className="subtitle-emphasis">real-time multiplayer matches</span>
              </p>
            </div>
            
            <div className="arena-features">
              <div className="arena-feature feature-1">
                <div className="feature-orb">
                  <div className="orb-inner">
                    <span className="orb-icon">🏆</span>
                  </div>
                  <div className="orb-glow"></div>
                </div>
                <div className="feature-info">
                  <h3>Compete for Rankings</h3>
                  <p>Climb the global leaderboard and prove your skills</p>
                </div>
              </div>
              <div className="arena-feature feature-2">
                <div className="feature-orb">
                  <div className="orb-inner">
                    <span className="orb-icon">⚡</span>
                  </div>
                  <div className="orb-glow"></div>
                </div>
                <div className="feature-info">
                  <h3>Real-time Gameplay</h3>
                  <p>Experience instant multiplayer battles with zero lag</p>
                </div>
              </div>
              <div className="arena-feature feature-3">
                <div className="feature-orb">
                  <div className="orb-inner">
                    <span className="orb-icon">📊</span>
                  </div>
                  <div className="orb-glow"></div>
                </div>
                <div className="feature-info">
                  <h3>Track Progress</h3>
                  <p>Monitor your gaming stats and achievements</p>
                </div>
              </div>
            </div>
            
            <div className="arena-actions">
              <Link to="/profile" className="arena-signin-btn">
                <div className="btn-bg-layers">
                  <div className="btn-layer layer-1"></div>
                  <div className="btn-layer layer-2"></div>
                  <div className="btn-layer layer-3"></div>
                </div>
                <div className="btn-energy">
                  <div className="energy-particle ep-1"></div>
                  <div className="energy-particle ep-2"></div>
                  <div className="energy-particle ep-3"></div>
                  <div className="energy-beam"></div>
                </div>
                <div className="btn-content">
                  <span className="btn-icon">🚀</span>
                  <span className="btn-text">Sign In to Play</span>
                </div>
                <div className="btn-plasma"></div>
                <div className="btn-ripple"></div>
              </Link>
              
              <div className="arena-alternative">
                <div className="alt-content">
                  <span className="alt-text">Or try</span>
                  <Link to="/single-player" className="alt-challenge-btn">
                    <div className="alt-btn-bg"></div>
                    <span className="alt-btn-text">AI Challenge</span>
                    <div className="alt-btn-glow"></div>
                  </Link>
                  <span className="alt-text">without signing in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`multiplayer-new ${!isDark ? 'light-theme' : ''}`}>
      <AnimatedBackground />
      <div className="mp-header">
        <Link to="/" className="mp-back-btn">
          <span>←</span> Back to Arena
        </Link>
        <div className="mp-title">
          <h1>Multiplayer Arena</h1>
          <p>Compete with Players Worldwide</p>
        </div>
      </div>

      <div className="mp-container">
        {gameState === 'lobby' && (
          <div className="mp-lobby">
            <div className="mp-welcome-card">
              <div className="mp-logo">
                <img src="https://cdn.shopify.com/s/files/1/0558/6413/1764/files/Hummingbird_Logo_Design_3_1024x1024.webp?v=1738757117" alt="Multiplayer" className="mp-logo-img" />
              </div>
              <h2>Join the Battle!</h2>
              <p>Create your own room or join existing battles with players worldwide</p>
              
              <div className="mp-actions">
                <button onClick={() => setGameState('create')} className="mp-create-btn">
                  Create Room
                </button>
                <button 
                  onClick={() => setRooms([])} 
                  className="mp-refresh-btn"
                >
                  Refresh
                </button>
              </div>

          <div className="rooms-list">
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px', verticalAlign: 'middle'}}>
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" fill="#4dd0e1"/>
              </svg>
              Active Game Rooms
            </h3>
            {rooms.length === 0 ? (
              <div className="empty-rooms">
                <p>No active rooms found. Create a new room to start playing!</p>
              </div>
            ) : (
              rooms.map(room => (
                <div key={room.roomId} className="mp-room-item">
                  <div className="mp-room-info">
                    <h4>{room.name}</h4>
                    <span>{room.players.length}/{room.maxPlayers} players</span>
                  </div>
                  <button 
                    onClick={() => joinRoom(room.roomId)}
                    className="mp-join-btn"
                    disabled={room.players.length >= room.maxPlayers}
                  >
                    {room.players.length >= room.maxPlayers ? 'Full' : 'Join'}
                  </button>
                </div>
              ))
            )}
            </div>
            </div>
          </div>
        )}

        {gameState === 'create' && (
          <div className="mp-create-room">
            <div className="create-room-card">
              <h2>Create New Room</h2>
              <div className="create-form">
                <div className="form-group">
                  <label>Room Name *</label>
                  <input
                    type="text"
                    placeholder="Enter room name"
                    value={roomForm.name}
                    onChange={(e) => setRoomForm({...roomForm, name: e.target.value})}
                    className="room-input"
                    maxLength={30}
                  />
                </div>
                <div className="form-group">
                  <label>Password (Optional)</label>
                  <input
                    type="password"
                    placeholder="Leave empty for public room"
                    value={roomForm.password}
                    onChange={(e) => setRoomForm({...roomForm, password: e.target.value})}
                    className="room-input"
                  />
                </div>
                <div className="create-actions">
                  <button onClick={createRoom} className="create-confirm-btn" disabled={!roomForm.name.trim()}>
                    🎮 Create Room
                  </button>
                  <button onClick={() => setGameState('lobby')} className="create-cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {gameState === 'room' && currentRoom && (
          <div className="mp-room-view">
            <div className="mp-room-card">
              <div className="room-header">
                <h2>{currentRoom.name}</h2>
                <div className="room-details">
                  <span className="room-id">Room ID: {currentRoom.roomId}</span>
                  <span className="player-count">{currentRoom.players.length}/{currentRoom.maxPlayers} Players</span>
                </div>
              </div>

              <div className="players-section">
                <h3>Players in Room</h3>
                <div className="players-grid">
                  {currentRoom.players.map((player, i) => (
                    <div key={i} className="player-card">
                      <div className="player-avatar">👤</div>
                      <span className="player-name">{player.username}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="room-actions">
                {currentRoom.players.length >= 2 ? (
                  <button onClick={startGame} className="start-game-btn">
                    🚀 Start Game
                  </button>
                ) : (
                  <p className="waiting-text">Waiting for more players to join...</p>
                )}
                <button onClick={() => {
                  // If room creator leaves, delete the room
                  if (currentRoom.players[0].username === user?.username) {
                    setRooms(rooms.filter(r => r.roomId !== currentRoom.roomId));
                  }
                  setCurrentRoom(null);
                  setGameState('lobby');
                }} className="leave-room-btn">
                  ← Leave Room
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState === 'spectator' && currentRoom && (
          <div className="mp-spectator-view">
            <div className="spectator-card">
              <div className="spectator-header">
                <div className="spectator-badge">
                  <span className="badge-icon">👁️</span>
                  <span className="badge-text">SPECTATOR MODE</span>
                </div>
                <h2>{currentRoom.name}</h2>
                <p className="spectator-info">You're watching this game. Room was full when you joined.</p>
              </div>

              <div className="spectator-players">
                <h3>Active Players</h3>
                <div className="players-grid">
                  {currentRoom.players.map((player, i) => (
                    <div key={i} className="player-card active">
                      <div className="player-avatar">🎮</div>
                      <span className="player-name">{player.username}</span>
                      <div className="player-status">Playing</div>
                    </div>
                  ))}
                </div>
              </div>

              {currentRoom.spectators && currentRoom.spectators.length > 0 && (
                <div className="spectator-list">
                  <h3>Other Spectators</h3>
                  <div className="spectators-grid">
                    {currentRoom.spectators.map((spectator, i) => (
                      <div key={i} className="spectator-item">
                        <span className="spectator-icon">👁️</span>
                        <span className="spectator-name">{spectator.username}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="spectator-actions">
                <button onClick={() => {
                  setCurrentRoom(null);
                  setGameState('lobby');
                }} className="leave-spectator-btn">
                  ← Leave Spectator Mode
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
        <div className="game-active">
          <h3>Guess the number between 1-100</h3>
          
          <form onSubmit={makeGuess} className="guess-form">
            <input
              type="number"
              min="1"
              max="100"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter your guess"
              className="guess-input"
              autoFocus
            />
            <button type="submit" className="btn btn-primary">Guess</button>
          </form>

          <div className="guesses-feed">
            <h4>Recent Guesses</h4>
            {guesses.slice(-10).map((g, i) => (
              <div key={i} className="guess-item">
                <strong>{g.username}:</strong> {g.guess} → {g.hint}
              </div>
            ))}
          </div>
          </div>
        )}

        {gameState === 'spectating-game' && (
          <div className="spectator-game-view">
            <div className="spectator-game-header">
              <div className="spectator-badge live">
                <span className="live-dot"></span>
                <span className="badge-text">LIVE SPECTATING</span>
              </div>
              <h3>Watching: {currentRoom?.name}</h3>
            </div>

            <div className="spectator-game-info">
              <p>Players are guessing a number between 1-100</p>
              <div className="spectator-players-status">
                {currentRoom?.players.map((player, i) => (
                  <div key={i} className="player-status-card">
                    <span className="player-name">{player.username}</span>
                    <span className="player-guesses">{player.guesses?.length || 0} guesses</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="spectator-guesses-feed">
              <h4>Live Game Feed</h4>
              <div className="live-feed">
                {guesses.slice(-15).map((g, i) => (
                  <div key={i} className="spectator-guess-item">
                    <span className="guess-timestamp">{new Date().toLocaleTimeString()}</span>
                    <span className="guess-player">{g.username}</span>
                    <span className="guess-number">{g.guess}</span>
                    <span className="guess-hint">{g.hint}</span>
                  </div>
                ))}
                {guesses.length === 0 && (
                  <div className="no-guesses">
                    <span>Waiting for players to make their first moves...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="spectator-controls">
              <button onClick={() => {
                setCurrentRoom(null);
                setGameState('lobby');
              }} className="leave-spectator-btn">
                ← Leave Game
              </button>
            </div>
          </div>
        )}

        {gameState === 'finished' && gameResult && (
        <div className="game-result">
          <h2>Game Over!</h2>
          <p className="winner">Winner: {gameResult.winner}</p>
          <p>The number was: <strong>{gameResult.targetNumber}</strong></p>
          <button 
            onClick={() => {
              setGameState('lobby');
              setCurrentRoom(null);
              socket?.emit('get-public-rooms');
            }}
            className="btn btn-primary"
          >
            Back to Lobby
          </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Multiplayer;
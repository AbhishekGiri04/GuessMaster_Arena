import React, { createContext, useContext, useReducer } from 'react';
import { io } from 'socket.io-client';

const GameContext = createContext();

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SOCKET':
      return { ...state, socket: action.payload };
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.payload };
    case 'ADD_GUESS':
      return { 
        ...state, 
        guesses: [...state.guesses, action.payload] 
      };
    case 'RESET_GAME':
      return { 
        ...state, 
        gameState: 'waiting', 
        guesses: [], 
        currentRoom: null 
      };
    case 'SET_ROOM':
      return { ...state, currentRoom: action.payload };
    default:
      return state;
  }
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, {
    socket: null,
    gameState: 'waiting',
    guesses: [],
    currentRoom: null
  });

  const connectSocket = () => {
    const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5001');
    dispatch({ type: 'SET_SOCKET', payload: socket });
    return socket;
  };

  const disconnectSocket = () => {
    if (state.socket) {
      state.socket.disconnect();
      dispatch({ type: 'SET_SOCKET', payload: null });
    }
  };

  const calculateLevel = (gamesPlayed) => {
    if (gamesPlayed < 10) return 1;
    if (gamesPlayed < 30) return Math.floor(gamesPlayed / 10) + 1;
    if (gamesPlayed < 60) return Math.floor((gamesPlayed - 30) / 20) + 4;
    return Math.floor((gamesPlayed - 60) / 30) + 6;
  };

  const updateUserStats = (gameResult) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const stats = currentUser.stats || { gamesPlayed: 0, gamesWon: 0, totalScore: 0, multiplayerWins: 0, winRate: 0 };
    
    const oldLevel = calculateLevel(stats.gamesPlayed);
    stats.gamesPlayed += 1;
    
    if (gameResult.won || gameResult.winner === 'player') {
      stats.gamesWon += 1;
      stats.totalScore += gameResult.score || 100;
      if (gameResult.isMultiplayer) {
        stats.multiplayerWins = (stats.multiplayerWins || 0) + 1;
      }
    }
    
    // Always recalculate win rate
    stats.winRate = stats.gamesPlayed > 0 ? (stats.gamesWon / stats.gamesPlayed) * 100 : 0;
    
    const newLevel = calculateLevel(stats.gamesPlayed);
    const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
    
    if (gameResult.won) {
      activities.unshift({
        type: 'win',
        icon: '🏆',
        text: gameResult.isMultiplayer ? 'Won multiplayer game' : 'Won against AI opponent',
        time: 'Just now'
      });
    }
    
    if (newLevel > oldLevel) {
      activities.unshift({
        type: 'achievement',
        icon: '⭐',
        text: `Reached Level ${newLevel}!`,
        time: 'Just now'
      });
    }
    
    if (gameResult.isMultiplayer && gameResult.won) {
      if (stats.multiplayerWins === 5) {
        activities.unshift({
          type: 'achievement',
          icon: '👥',
          text: 'Unlocked "Multiplayer Master" badge',
          time: 'Just now'
        });
      } else if (stats.multiplayerWins === 10) {
        activities.unshift({
          type: 'achievement',
          icon: '👑',
          text: 'Unlocked "Champion" badge',
          time: 'Just now'
        });
      }
    }
    
    localStorage.setItem('userActivities', JSON.stringify(activities.slice(0, 10)));
    
    // Update current user with new stats
    const updatedUser = { ...currentUser, stats };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update registered users data for leaderboard
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    if (registeredUsers[currentUser.email]) {
      registeredUsers[currentUser.email] = { ...registeredUsers[currentUser.email], stats };
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }
    
    return updatedUser;
  };

  return (
    <GameContext.Provider value={{ 
      ...state, 
      socket: state.socket,
      dispatch, 
      connectSocket, 
      disconnectSocket,
      updateUserStats 
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
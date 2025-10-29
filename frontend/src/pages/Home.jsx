import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/Auth';

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

const Home = () => {
  const { user, isAuthenticated, logout, login } = useAuth();
  const location = useLocation();
  const [currentUser, setCurrentUser] = React.useState(user);

  // Update user data in real-time
  React.useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (updatedUser.username) {
        setCurrentUser(updatedUser);
      }
    };
    
    handleStorageChange(); // Initial load
    const interval = setInterval(handleStorageChange, 1000); // Check every second
    
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const userData = urlParams.get('user');
    
    if (token && userData) {
      localStorage.setItem('token', token);
      const user = JSON.parse(decodeURIComponent(userData));
      login({ ...user, token });
      window.history.replaceState({}, document.title, '/');
    }
  }, [location, login]);

  return (
    <div className="home">
      <AnimatedBackground />
      <main className="main-content">
        <div className="hero">
          <h2>Competitive Number Guessing Arena</h2>
          <p>Battle smart AI opponents and compete with players worldwide in real-time gaming action</p>
        </div>

        <div className="game-modes">
          <div className="mode-card single-player-card">
            <div className="mode-logo">
              <img src="https://img.freepik.com/premium-vector/game-neon-sign-bright-signboard-light-banner-game-joystick-fire-logo-neon-emblem_191108-328.jpg" alt="Single Player" className="mode-image" />
            </div>
            <h3>
              <span className="mode-icon">🤖</span>
              AI Challenge
            </h3>
            <p>Battle against our intelligent AI opponent with advanced strategies and adaptive difficulty</p>
            <div className="mode-features">
              <span className="feature-tag">⚡ Smart AI</span>
              <span className="feature-tag">🏆 Solo Victory</span>
            </div>
            <Link to="/single-player" className="btn btn-mode btn-single">
              <span>🚀</span> Start Challenge
            </Link>
          </div>

          <div className="mode-card multiplayer-card">
            <div className="mode-logo">
              <img src="https://i.pinimg.com/736x/83/80/d2/8380d21b040094020ff538241a139cb5.jpg" alt="Multiplayer" className="mode-image" />
            </div>
            <h3>
              <span className="mode-icon">👥</span>
              Multiplayer Arena
            </h3>
            <p>Compete with players worldwide in real-time battles and climb the global leaderboard</p>
            <div className="mode-features">
              <span className="feature-tag">🌍 Global Players</span>
              <span className="feature-tag">⚡ Real-time Battle</span>
            </div>
            <Link to="/multiplayer" className="btn btn-mode btn-multi">
              <span>🎯</span> Enter Arena
            </Link>
          </div>
        </div>

        {isAuthenticated && (
          <div className="user-stats">
            <h3>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px', verticalAlign: 'middle'}}>
                <path d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z" fill="#4dd0e1"/>
              </svg>
              Performance Analytics
            </h3>
            <div className="stats-grid">
              <div className="stat">
                <span className="stat-value">{currentUser?.stats?.gamesPlayed || 0}</span>
                <span className="stat-label">Games Played</span>
              </div>
              <div className="stat">
                <span className="stat-value">{currentUser?.stats?.gamesWon || 0}</span>
                <span className="stat-label">Games Won</span>
              </div>
              <div className="stat">
                <span className="stat-value">{currentUser?.stats?.winRate?.toFixed(1) || '0.0'}%</span>
                <span className="stat-label">Win Rate</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
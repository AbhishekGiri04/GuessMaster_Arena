import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import { useTheme } from '../context/Theme';

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="top-nav">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <div className="logo-container">
            <img src="https://wallpaperbat.com/img/824890-gamer-logo-4k-wallpaper.jpg" alt="GuessMaster Arena" className="logo-icon" />
            <div className="logo-text">
              <span className="logo-main">GuessMaster</span>
              <span className="logo-sub">ARENA</span>
            </div>
          </div>
        </Link>

        <div className="nav-center">
          <div className="nav-links">
            <Link to="/" className="nav-link">
              <div className="nav-link-content">
                <img src="https://cdn-icons-png.flaticon.com/512/6003/6003723.png" alt="Home" className="nav-icon" />
                <span>Home</span>
              </div>
            </Link>
            <Link to="/leaderboard" className="nav-link">
              <div className="nav-link-content">
                <img src="https://badgeos.org/wp-content/uploads/edd/2013/11/leaderboard.png" alt="Leaderboard" className="nav-icon" />
                <span>Leaderboard</span>
              </div>
            </Link>
            {isAuthenticated && (
              <Link to="/profile" className="nav-link">
                <div className="nav-link-content">
                  <img src="https://static.vecteezy.com/system/resources/previews/065/760/026/non_2x/cool-anime-boy-profile-portraits-logo-vector.jpg" alt="Profile" className="nav-icon" />
                  <span>Profile</span>
                </div>
              </Link>
            )}
          </div>
        </div>

        <div className="nav-right">
          <button onClick={toggleTheme} className="theme-toggle">
            {isDark ? '☀️' : '🌙'}
          </button>
          {isAuthenticated ? (
            <div className="nav-user">
              <div className="user-info">
                <img src="https://static.vecteezy.com/system/resources/previews/065/760/026/non_2x/cool-anime-boy-profile-portraits-logo-vector.jpg" alt="User" className="user-avatar" />
                <div className="user-details">
                  <span className="user-name">{user?.username}</span>
                  <span className="user-status">Online</span>
                </div>
              </div>
              <button onClick={logout} className="btn btn-logout">
                <img src="https://cdn-icons-png.flaticon.com/512/4400/4400828.png" alt="Logout" className="logout-icon" />
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-login">
                <span>Login</span>
              </Link>
              <Link to="/register" className="btn btn-signup">
                <span>Join Arena</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
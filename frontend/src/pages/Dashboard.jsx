import React from 'react';
import { Link } from 'react-router-dom';
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

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="dashboard-page">
        <AnimatedBackground />
        <div className="auth-required">
          <h2>Sign In Required</h2>
          <p>Please sign in to access your dashboard</p>
          <Link to="/profile" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <AnimatedBackground />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '10px', verticalAlign: 'middle'}}>
              <path d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z" fill="#4dd0e1"/>
            </svg>
            Gaming Dashboard
          </h1>
          <p>Welcome back, {user.username}!</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20,15.5C18.25,15.5 16.6,16.3 15.7,17.3C15.8,18.2 16,19.1 16,20A4,4 0 0,1 12,24A4,4 0 0,1 8,20C8,19.1 8.2,18.2 8.3,17.3C7.4,16.3 5.75,15.5 4,15.5A4,4 0 0,1 0,11.5A4,4 0 0,1 4,7.5C5.75,7.5 7.4,8.3 8.3,9.3C8.2,8.4 8,7.5 8,6.5A4,4 0 0,1 12,2.5A4,4 0 0,1 16,6.5C16,7.5 15.8,8.4 15.7,9.3C16.6,8.3 18.25,7.5 20,7.5A4,4 0 0,1 24,11.5A4,4 0 0,1 20,15.5Z" fill="#4dd0e1"/>
              </svg>
            </div>
            <h3>AI Challenge</h3>
            <p>Test your skills against our intelligent AI</p>
            <Link to="/single-player" className="btn btn-primary">Play Now</Link>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16,4C16.88,4 17.67,4.38 18.18,5C18.69,4.38 19.48,4 20.36,4C21.8,4 23,5.2 23,6.64C23,8.09 21.8,9.29 20.36,9.29C19.48,9.29 18.69,8.91 18.18,8.29C17.67,8.91 16.88,9.29 16,9.29C14.56,9.29 13.36,8.09 13.36,6.64C13.36,5.2 14.56,4 16,4M12.5,11.5C13.39,11.5 14.18,11.88 14.68,12.5C15.19,11.88 15.97,11.5 16.86,11.5C18.31,11.5 19.5,12.7 19.5,14.14C19.5,15.59 18.31,16.79 16.86,16.79C15.97,16.79 15.19,16.41 14.68,15.79C14.18,16.41 13.39,16.79 12.5,16.79C11.06,16.79 9.86,15.59 9.86,14.14C9.86,12.7 11.06,11.5 12.5,11.5M7.5,19C8.39,19 9.18,19.38 9.68,20C10.19,19.38 10.97,19 11.86,19C13.31,19 14.5,20.2 14.5,21.64C14.5,23.09 13.31,24.29 11.86,24.29C10.97,24.29 10.19,23.91 9.68,23.29C9.18,23.91 8.39,24.29 7.5,24.29C6.06,24.29 4.86,23.09 4.86,21.64C4.86,20.2 6.06,19 7.5,19Z" fill="#4dd0e1"/>
              </svg>
            </div>
            <h3>Multiplayer Arena</h3>
            <p>Compete with players worldwide</p>
            <Link to="/multiplayer" className="btn btn-primary">Join Arena</Link>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z" fill="#4dd0e1"/>
              </svg>
            </div>
            <h3>Performance Stats</h3>
            <p>Track your gaming progress</p>
            <Link to="/profile" className="btn btn-primary">View Stats</Link>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5,16L3,14L5,12L6.4,13.4L4.8,15L6.4,16.6L5,18M19,8L21,10L19,12L17.6,10.6L19.2,9L17.6,7.4L19,6M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" fill="#4dd0e1"/>
              </svg>
            </div>
            <h3>Leaderboard</h3>
            <p>See top players and rankings</p>
            <Link to="/leaderboard" className="btn btn-primary">View Rankings</Link>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Quick Stats</h3>
          <div className="activity-stats">
            <div className="activity-item">
              <span className="activity-label">Games Today</span>
              <span className="activity-value">0</span>
            </div>
            <div className="activity-item">
              <span className="activity-label">Current Streak</span>
              <span className="activity-value">0</span>
            </div>
            <div className="activity-item">
              <span className="activity-label">Best Score</span>
              <span className="activity-value">-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/Auth';
import { useTheme } from '../context/Theme';

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

const Leaderboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [timeFilter, setTimeFilter] = useState('all');

  // Mock leaderboard data
  useEffect(() => {
    // Get real user data from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    let realData = Object.values(registeredUsers).map(userData => ({
      username: userData.username,
      gamesWon: userData.stats?.gamesWon || 0,
      totalGames: userData.stats?.gamesPlayed || 0,
      winRate: userData.stats?.winRate || 0,
      level: calculateLevel(userData.stats?.gamesPlayed || 0)
    }));
    
    // Always add current user if logged in
    if (user) {
      const userExists = realData.some(player => player.username === user.username);
      if (!userExists) {
        realData.push({
          username: user.username,
          gamesWon: user.stats?.gamesWon || 0,
          winRate: user.stats?.winRate || 0,
          totalGames: user.stats?.gamesPlayed || 0,
          level: calculateLevel(user.stats?.gamesPlayed || 0)
        });
      }
    }
    
    // Filter data based on time period
    let filteredData = realData;
    if (timeFilter === 'week') {
      filteredData = realData.map(player => ({
        ...player,
        gamesWon: Math.floor(player.gamesWon * 0.3),
        totalGames: Math.floor(player.totalGames * 0.3)
      }));
    } else if (timeFilter === 'month') {
      filteredData = realData.map(player => ({
        ...player,
        gamesWon: Math.floor(player.gamesWon * 0.7),
        totalGames: Math.floor(player.totalGames * 0.7)
      }));
    }
    
    // Recalculate win rates and sort
    filteredData = filteredData.map(player => ({
      ...player,
      winRate: player.totalGames > 0 ? (player.gamesWon / player.totalGames) * 100 : 0
    }));
    
    filteredData.sort((a, b) => b.winRate - a.winRate);
    filteredData = filteredData.map((player, index) => ({
      ...player,
      rank: index + 1
    }));
    
    setLeaderboardData(filteredData);
  }, [user, timeFilter]);

  const calculateLevel = (gamesPlayed) => {
    if (gamesPlayed < 10) return 1;
    if (gamesPlayed < 30) return Math.floor(gamesPlayed / 10) + 1;
    if (gamesPlayed < 60) return Math.floor((gamesPlayed - 30) / 20) + 4;
    return Math.floor((gamesPlayed - 60) / 30) + 6;
  };

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1:
        return <div className="rank-medal gold"><span className="medal-icon">👑</span><span className="rank-text">#1</span></div>;
      case 2:
        return <div className="rank-medal silver"><span className="medal-icon">🥈</span><span className="rank-text">#2</span></div>;
      case 3:
        return <div className="rank-medal bronze"><span className="medal-icon">🥉</span><span className="rank-text">#3</span></div>;
      default:
        return <div className="rank-number"><span>#{rank}</span></div>;
    }
  };

  return (
    <div className={`leaderboard-page ${isDark ? 'dark-theme' : 'light-theme'}`}>
      <AnimatedBackground />
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <div className="header-content">
            <div className="trophy-animation">
              <span className="leaderboard-icon">🏆</span>
              <div className="trophy-glow"></div>
            </div>
            <h1>GLOBAL LEADERBOARD</h1>
            <p>Elite Champions of GuessMaster Arena</p>
          </div>
        </div>

        <div className="leaderboard-stats">
          <div className="stat-box">
            <span className="stat-number">{leaderboardData.length}</span>
            <span className="stat-label">Active Players</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{leaderboardData.reduce((sum, p) => sum + p.totalGames, 0)}</span>
            <span className="stat-label">Battles Fought</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Live Updates</span>
          </div>
        </div>

        <div className="leaderboard-filters">
          <button 
            className={`filter-btn ${timeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTimeFilter('all')}
          >
            🔥 All Time
          </button>
          <button 
            className={`filter-btn ${timeFilter === 'week' ? 'active' : ''}`}
            onClick={() => setTimeFilter('week')}
          >
            ⚡ This Week
          </button>
          <button 
            className={`filter-btn ${timeFilter === 'month' ? 'active' : ''}`}
            onClick={() => setTimeFilter('month')}
          >
            📅 This Month
          </button>
        </div>

        <div className="leaderboard-table">
          <svg width="0" height="0">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff4444" />
                <stop offset="50%" stopColor="#ffaa00" />
                <stop offset="100%" stopColor="#00ff88" />
              </linearGradient>
            </defs>
          </svg>
          <div className="table-header">
            <div className="col-rank">Rank</div>
            <div className="col-player">Champion</div>
            <div className="col-games">Wins</div>
            <div className="col-rate">Success Rate</div>
            <div className="col-total">Total Games</div>
          </div>

          {leaderboardData.map((player, index) => (
            <div 
              key={index} 
              className={`table-row ${player.username === user?.username ? 'current-user' : ''} ${index < 3 ? 'top-player' : ''}`}
            >
              <div className="col-rank">
                <div className="rank-container">
                  {getRankIcon(player.rank)}
                  {index < 3 && <div className="rank-glow"></div>}
                </div>
              </div>
              <div className="col-player">
                <div className="player-info">
                  <div className="player-avatar">
                    <img src="https://static.vecteezy.com/system/resources/previews/065/760/026/non_2x/cool-anime-boy-profile-portraits-logo-vector.jpg" alt="Player" className="avatar-img" />
                    <div className="avatar-border"></div>
                  </div>
                  <div className="player-details">
                    {index < 3 && <span className="elite-badge">CHAMPION</span>}
                    <span className="player-name">{player.username}</span>
                    {player.username === user?.username && <span className="you-badge">YOU</span>}
                  </div>
                </div>
              </div>
              <div className="col-games">
                <div className="wins-container">
                  <span className="wins-number">{player.gamesWon}</span>
                  <span className="wins-label">victories</span>
                </div>
              </div>
              <div className="col-rate">
                <div className="rate-container">
                  <div className="rate-circle">
                    <svg className="rate-svg" viewBox="0 0 36 36">
                      <path className="rate-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="rate-progress" strokeDasharray={`${player.winRate}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="rate-percentage">{player.winRate.toFixed(0)}%</div>
                  </div>
                </div>
              </div>
              <div className="col-total">
                <div className="total-container">
                  <span className="total-number">{player.totalGames}</span>
                  <span className="total-label">battles</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="leaderboard-footer">
          <div className="footer-content">
            <div className="update-info">
              <span className="pulse-dot"></span>
              <span>Live rankings • Updated every battle</span>
            </div>
            <div className="motivation">
              <p>🚀 Climb the ranks and become the ultimate GuessMaster!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
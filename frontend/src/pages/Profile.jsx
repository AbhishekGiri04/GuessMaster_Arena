import React from 'react';
import { useAuth } from '../context/Auth';
import { useTheme } from '../context/Theme';
import GoogleLoginButton from '../components/GoogleLogin';
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

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = React.useState(false);
  const [timeFilter, setTimeFilter] = React.useState('all');
  const [currentUser, setCurrentUser] = React.useState(user);
  const [editData, setEditData] = React.useState({
    photo: 'https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png',
    username: user?.username || 'Abhi22',
    email: user?.email || 'abhi22@arena.com',
    title: 'Gaming Champion'
  });

  // Update user data when it changes
  React.useEffect(() => {
    const updatedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (updatedUser.username) {
      setCurrentUser(updatedUser);
      // Update editData with current user data
      setEditData({
        photo: updatedUser.photo || 'https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png',
        username: updatedUser.username || 'Abhi22',
        email: updatedUser.email || 'abhi22@arena.com',
        title: updatedUser.title || 'Gaming Champion'
      });
    }
  }, [user]);

  // Listen for storage changes to update profile in real-time
  React.useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (updatedUser.username) {
        setCurrentUser(updatedUser);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000); // Check every second
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditData({...editData, photo: e.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Save to current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const updatedUser = { ...currentUser, ...editData };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Also save to registered users for persistence
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    if (currentUser.email && registeredUsers[currentUser.email]) {
      registeredUsers[currentUser.email] = { ...registeredUsers[currentUser.email], ...editData };
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }
    
    setCurrentUser(updatedUser);
    setIsEditing(false);
  };

  const getRecentActivity = () => {
    const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
    return activities.slice(0, 4).map(activity => ({
      ...activity,
      text: activity.description,
      time: new Date(activity.timestamp).toLocaleString(),
      type: activity.type.toLowerCase().replace(/\s+/g, '-')
    }));
  };

  const getAchievements = () => {
    const stats = currentUser?.stats || { gamesPlayed: 0, gamesWon: 0, multiplayerWins: 0 };
    const level = Math.floor(stats.gamesPlayed / 10) + 1;
    
    return [
      {
        name: 'First Victory',
        description: 'Won your first game',
        icon: 'WIN',
        unlocked: stats.gamesWon >= 1,
        date: stats.gamesWon >= 1 ? 'Recently' : null,
        progress: Math.min((stats.gamesWon / 1) * 100, 100)
      },
      {
        name: 'Level Up',
        description: 'Reached level 5',
        icon: 'LVL',
        unlocked: level >= 5,
        date: level >= 5 ? 'Recently' : null,
        progress: Math.min((level / 5) * 100, 100)
      },
      {
        name: 'Multiplayer Master',
        description: 'Won 5 multiplayer games',
        icon: 'MP',
        unlocked: (stats.multiplayerWins || 0) >= 5,
        date: (stats.multiplayerWins || 0) >= 5 ? 'Recently' : null,
        progress: Math.min(((stats.multiplayerWins || 0) / 5) * 100, 100)
      },
      {
        name: 'Champion',
        description: 'Won 10 multiplayer games',
        icon: 'CHAMP',
        unlocked: (stats.multiplayerWins || 0) >= 10,
        date: (stats.multiplayerWins || 0) >= 10 ? 'Recently' : null,
        progress: Math.min(((stats.multiplayerWins || 0) / 10) * 100, 100)
      }
    ];
  };

  const getFilteredStats = () => {
    const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
    
    if (timeFilter === 'all') {
      return {
        gamesPlayed: user?.stats?.gamesPlayed || 0,
        gamesWon: user?.stats?.gamesWon || 0,
        winRate: user?.stats?.winRate?.toFixed(1) || '0.0',
        totalScore: user?.stats?.totalScore || 0
      };
    }

    let filteredActivities = activities;
    if (timeFilter === 'week') {
      filteredActivities = activities.filter(activity => 
        activity.time === 'Just now' || activity.time.includes('hour') || activity.time.includes('day')
      );
    } else if (timeFilter === 'month') {
      filteredActivities = activities.filter(activity => 
        activity.time === 'Just now' || activity.time.includes('hour') || 
        activity.time.includes('day') || activity.time.includes('week')
      );
    }

    const wins = filteredActivities.filter(a => a.type === 'win').length;
    const totalGames = Math.max(wins, filteredActivities.length);
    const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : '0.0';
    const totalScore = wins * 100;

    return {
      gamesPlayed: totalGames,
      gamesWon: wins,
      winRate,
      totalScore
    };
  };

  if (!isAuthenticated) {
    return (
      <div className={`profile-page ${!isDark ? 'light-theme' : ''}`}>
        <AnimatedBackground />
        <div className="auth-container-improved">
          <div className="auth-header">
            <div className="auth-logo">
              <img src="https://img.freepik.com/premium-photo/black-background-with-rooster-it_1207067-1158.jpg?semt=ais_hybrid&w=740&q=80" alt="GuessMaster Arena" className="auth-logo-img" />
            </div>
            <h1>Welcome to GuessMaster Arena</h1>
            <h2>Sign in to unlock your gaming profile</h2>
          </div>
          
          <div className="auth-options">
            <GoogleLoginButton />
            <div className="divider">
              <span>or</span>
            </div>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
            <p className="auth-note">
              Sign in to save your progress, compete with others, and access exclusive features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`profile-page ${!isDark ? 'light-theme' : ''}`}>
      <AnimatedBackground />
      <div className="profile-container-new">
        {/* Profile Header */}
        <div className="profile-header-new">
          <div className="profile-cover">
            <div className="cover-gradient"></div>
            <div className="cover-mesh"></div>
            <div className="cover-particles">
              <div className="particle p1"></div>
              <div className="particle p2"></div>
              <div className="particle p3"></div>
              <div className="particle p4"></div>
              <div className="particle p5"></div>
              <div className="particle p6"></div>
              <div className="particle p7"></div>
              <div className="particle p8"></div>
            </div>
            <div className="cover-shapes">
              <div className="geometric-shape shape-1"></div>
              <div className="geometric-shape shape-2"></div>
              <div className="geometric-shape shape-3"></div>
              <div className="geometric-shape shape-4"></div>
              <div className="geometric-shape shape-5"></div>
            </div>
          </div>
          <div className="profile-main">
            <div className="avatar-section">
              <div className="avatar-wrapper">
                <img src={editData.photo} alt="Profile" className="avatar-new" />
                <div className="status-indicator online"></div>
                <div className="avatar-ring"></div>
              </div>
            </div>
            <div className="profile-details">
              <h1 className="username-new">{editData.username}</h1>
              <p className="user-title-colored">{editData.title}</p>
              <div className="user-meta">
                <span className="join-date">📅 Joined {user?.joinDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                <span className="location">🌍 Global Arena</span>
              </div>
              <div className="profile-badges-new">
                <span className="badge-new verified"><div className="badge-icon check"></div> Verified</span>
                <span className="badge-new premium"><div className="badge-icon star"></div> Pro Player</span>
                <span className="badge-new level"><div className="badge-icon target"></div> Level {Math.floor((currentUser?.stats?.gamesPlayed || 0) / 10) + 1}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="stats-dashboard">
          <div className="dashboard-header">
            <h2>Performance Analytics</h2>
            <div className="time-filter">
              <button 
                className={`filter-btn ${timeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setTimeFilter('all')}
              >
                All Time
              </button>
              <button 
                className={`filter-btn ${timeFilter === 'month' ? 'active' : ''}`}
                onClick={() => setTimeFilter('month')}
              >
                This Month
              </button>
              <button 
                className={`filter-btn ${timeFilter === 'week' ? 'active' : ''}`}
                onClick={() => setTimeFilter('week')}
              >
                This Week
              </button>
            </div>
          </div>
          
          <div className="stats-grid-new">
            <div className="stat-card-new primary">
              <div className="stat-header">
                <div className="stat-icon-new">🎮</div>
                <div className="stat-trend up">+12%</div>
              </div>
              <div className="stat-number">{currentUser?.stats?.gamesPlayed || 0}</div>
              <div className="stat-label-new">Total Games</div>
              <div className="stat-bar">
                <div className="stat-fill" style={{width: '75%'}}></div>
              </div>
            </div>

            <div className="stat-card-new success">
              <div className="stat-header">
                <div className="stat-icon-new">🏆</div>
                <div className="stat-trend up">+8%</div>
              </div>
              <div className="stat-number">{currentUser?.stats?.gamesWon || 0}</div>
              <div className="stat-label-new">Victories</div>
              <div className="stat-bar">
                <div className="stat-fill" style={{width: '68%'}}></div>
              </div>
            </div>

            <div className="stat-card-new warning">
              <div className="stat-header">
                <div className="stat-icon-new">⚡</div>
                <div className="stat-trend up">+5%</div>
              </div>
              <div className="stat-number">{currentUser?.stats?.winRate?.toFixed(1) || 0.0}%</div>
              <div className="stat-label-new">Win Rate</div>
              <div className="stat-bar">
                <div className="stat-fill" style={{width: '68%'}}></div>
              </div>
            </div>

            <div className="stat-card-new info">
              <div className="stat-header">
                <div className="stat-icon-new">🎯</div>
                <div className="stat-trend up">+15%</div>
              </div>
              <div className="stat-number">{currentUser?.stats?.totalScore || 0}</div>
              <div className="stat-label-new">Total Score</div>
              <div className="stat-bar">
                <div className="stat-fill" style={{width: '82%'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Achievements */}
        <div className="profile-content">
          <div className="content-left">
            <div className="activity-section">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {getRecentActivity().length > 0 ? (
                  getRecentActivity().map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className={`activity-icon ${activity.type}`}>
                        {activity.icon === '🤖' ? 'AI' : 
                         activity.icon === '🏠' ? 'ROOM' : 
                         activity.icon === '🚪' ? 'JOIN' : 
                         activity.icon === '⚔️' ? 'BATTLE' : 
                         activity.icon}
                      </div>
                      <div className="activity-details">
                        <p className="activity-text">{activity.text}</p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No recent activity. Start playing to see your progress!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="content-right">
            <div className="achievements-section">
              <h3>Achievements</h3>
              <div className="achievements-list">
                {getAchievements().map((achievement, index) => (
                  <div key={index} className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
                    <div className="achievement-icon-new">{achievement.icon}</div>
                    <div className="achievement-content">
                      <h4>{achievement.name}</h4>
                      <p>{achievement.description}</p>
                      {achievement.unlocked ? (
                        <div className="achievement-date">Unlocked {achievement.date}</div>
                      ) : (
                        <div className="achievement-progress">Progress: {achievement.progress}%</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-actions-new">
          <button className="action-btn primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
          <button onClick={logout} className="action-btn danger">
            Sign Out
          </button>
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <div className="edit-modal-overlay" onClick={() => setIsEditing(false)}>
            <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Edit Profile</h3>
                <button className="close-btn" onClick={() => setIsEditing(false)}>×</button>
              </div>
              <div className="modal-content">
                <div className="edit-section">
                  <label>Profile Photo</label>
                  <div className="photo-edit">
                    <img src={editData.photo} alt="Profile" className="edit-avatar" />
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="edit-input"
                    />
                  </div>
                </div>
                <div className="edit-section">
                  <label>Username</label>
                  <input 
                    type="text" 
                    value={editData.username}
                    onChange={(e) => setEditData({...editData, username: e.target.value})}
                    className="edit-input"
                  />
                </div>
                <div className="edit-section">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className="edit-input"
                  />
                </div>
                <div className="edit-section">
                  <label>Title</label>
                  <input 
                    type="text" 
                    value={editData.title}
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                    className="edit-input"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button className="action-btn secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="action-btn primary" onClick={handleSave}>Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
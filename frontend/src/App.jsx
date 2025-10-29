import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/Auth';
import { GameProvider } from './context/Game';
import { ThemeProvider } from './context/Theme';
import LoadingScreen from './components/Loading';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Register from './pages/Register';
import SinglePlayer from './pages/SinglePlayer';
import Multiplayer from './pages/Multiplayer';
import GameGuide from './pages/GameGuide';
import Support from './pages/Support';
import './styles/main.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <GameProvider>
          <Router>
            <div className="App">
              <Navigation />
              <div className="page-transition">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/single-player" element={<SinglePlayer />} />
                  <Route path="/multiplayer" element={<Multiplayer />} />
                  <Route path="/guide" element={<GameGuide />} />
                  <Route path="/support" element={<Support />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </Router>
        </GameProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
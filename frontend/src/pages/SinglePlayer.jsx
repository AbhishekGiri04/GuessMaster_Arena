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
    <div className="neural-network">
      <div className="neural-line"></div>
      <div className="neural-line"></div>
      <div className="neural-line"></div>
      <div className="neural-line"></div>
      <div className="neural-line"></div>
    </div>
    <div className="ai-particles">
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
    </div>
  </div>
);

const SinglePlayer = () => {
  const { socket, connectSocket, disconnectSocket, updateUserStats } = useGame();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [guess, setGuess] = useState('');
  const [gameState, setGameState] = useState('waiting');
  const [guesses, setGuesses] = useState([]);
  const [aiGuesses, setAiGuesses] = useState([]);
  const [gameResult, setGameResult] = useState(null);
  const [playerWins, setPlayerWins] = useState(0);
  const [aiWins, setAiWins] = useState(0);

  useEffect(() => {
    const gameSocket = connectSocket();

    gameSocket.on('game-started', () => {
      setGameState('playing');
      setGuesses([]);
      setAiGuesses([]);
      setGameResult(null);
    });

    gameSocket.on('guess-result', (data) => {
      if (data.player === 'human') {
        setGuesses(prev => [...prev, { guess: data.guess, hint: data.hint }]);
      } else {
        setAiGuesses(prev => [...prev, { guess: data.guess, hint: data.hint }]);
      }
    });

    gameSocket.on('game-over', (data) => {
      setGameState('finished');
      setGameResult(data);
      
      // Update win counters
      if (data.winner === 'player') {
        setPlayerWins(prev => prev + 1);
      } else {
        setAiWins(prev => prev + 1);
      }
      
      // Update user stats when game ends
      if (user) {
        updateUserStats({
          won: data.winner === 'player',
          winner: data.winner,
          score: 100,
          isMultiplayer: false
        });
      }
    });

    gameSocket.on('error', (data) => {
      console.error('Game error:', data.message);
      alert(data.message || 'An error occurred');
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  const startGame = () => {
    if (socket) {
      socket.emit('start-single-player', {
        userId: user?._id,
        username: user?.username || 'Guest'
      });
      
      // Add activity for starting AI game
      if (user) {
        const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
        const newActivity = {
          type: 'AI Challenge Started',
          description: 'Started a battle against AI opponent',
          timestamp: new Date().toISOString(),
          icon: 'AI'
        };
        activities.unshift(newActivity);
        localStorage.setItem('userActivities', JSON.stringify(activities.slice(0, 10)));
      }
    }
  };

  const makeGuess = (e) => {
    e.preventDefault();
    const guessNum = parseInt(guess);
    if (guessNum >= 1 && guessNum <= 100 && socket) {
      socket.emit('player-guess', { guess: guessNum });
      setGuess('');
    }
  };

  return (
    <div className={`single-player-new ${!isDark ? 'light-theme' : ''}`}>
      <AnimatedBackground />
      <div className="sp-header">
        <Link to="/" className="sp-back-btn">
          <span>←</span> Back to Arena
        </Link>
        <div className="sp-title">
          <h1>AI Challenge</h1>
          <p>Battle Against Advanced Intelligence</p>
        </div>
      </div>

      <div className="sp-container">
        {gameState === 'waiting' && (
          <div className="sp-welcome">
            <div className="sp-welcome-card">
              <div className="sp-logo-section">
                <img src="https://media.istockphoto.com/id/1492548051/vector/chatbot-logo-icon.jpg?s=612x612&w=0&k=20&c=oh9mrvB70HTRt0FkZqOu9uIiiJFH9FaQWW3p4M6iNno=" alt="AI Logo" className="sp-main-logo" />
                <div className="sp-title-section">
                  <h1 className="sp-main-title">AI Challenge</h1>
                  <p className="sp-subtitle">Battle Against Advanced Intelligence</p>
                </div>
              </div>
              <div className="sp-ai-avatar">
                <div className="ai-brain">
                  <div className="ai-core">
                    <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/mascot-logo-game-template-design-1c342721af365cecf352cc0267426340_screen.jpg?ts=1630305080" alt="AI" className="ai-face-img" />
                    <div className="ai-pulse-ring"></div>
                    <div className="ai-pulse-ring delay-1"></div>
                    <div className="ai-pulse-ring delay-2"></div>
                  </div>
                  <div className="ai-neural-web">
                    <div className="neural-node"></div>
                    <div className="neural-node"></div>
                    <div className="neural-node"></div>
                    <div className="neural-node"></div>
                  </div>
                </div>
              </div>
              <h2>Ready for the Challenge?</h2>
              <p>Face our advanced AI in an epic number guessing battle. The AI learns from every move!</p>
              
              <div className="sp-stats">
                <div className="sp-stat">
                  <span className="stat-icon">🎯</span>
                  <span className="stat-text">Strategic AI</span>
                </div>
                <div className="sp-stat">
                  <span className="stat-icon">⚡</span>
                  <span className="stat-text">Real-time Battle</span>
                </div>
                <div className="sp-stat">
                  <span className="stat-icon">🏆</span>
                  <span className="stat-text">Skill Tracking</span>
                </div>
              </div>
              
              <div className="sp-rules">
                <h3>🎮 How to Play</h3>
                <ul>
                  <li>Guess a number between 1-100</li>
                  <li>Get hints: "Higher" or "Lower"</li>
                  <li>Beat the AI with fewer guesses!</li>
                </ul>
              </div>
              
              <button onClick={startGame} className="sp-start-btn">
                <span className="btn-glow"></span>
                <span className="btn-text">🚀 Start Battle</span>
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="sp-battle">
            <div className="sp-battle-header">
              <div className="win-counter">
                <div className="counter-section player-section">
                  <div className="counter-label">PLAYER</div>
                  <div className="counter-score player-wins">{playerWins}</div>
                </div>
                <div className="counter-vs">
                  <div className="vs-circle">
                    <span className="vs-text">VS</span>
                  </div>
                </div>
                <div className="counter-section ai-section">
                  <div className="counter-label">AI NEXUS</div>
                  <div className="counter-score ai-wins">{aiWins}</div>
                </div>
              </div>
              <h2>Find the Secret Number (1-100)</h2>
              <div className="sp-vs">
                <div className="sp-player">
                  <div className="player-avatar">
                    <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/mascot-logo-game-template-design-1c342721af365cecf352cc0267426340_screen.jpg?ts=1630305080" alt="Player" className="player-face-img" />
                  </div>
                  <span>You</span>
                  <div className="score-badge">{guesses.length}</div>
                </div>
                <div className="vs-text">VS</div>
                <div className="sp-ai">
                  <div className="ai-avatar-battle">
                    <img src="https://media.istockphoto.com/id/1492548051/vector/chatbot-logo-icon.jpg?s=612x612&w=0&k=20&c=oh9mrvB70HTRt0FkZqOu9uIiiJFH9FaQWW3p4M6iNno=" alt="AI" className="ai-face-battle-img" />
                    <div className="ai-thinking-indicator">
                      <div className="thinking-dot"></div>
                      <div className="thinking-dot"></div>
                      <div className="thinking-dot"></div>
                    </div>
                  </div>
                  <span>AI Nexus</span>
                  <div className="score-badge ai">{aiGuesses.length}</div>
                </div>
              </div>
            </div>

            <div className="sp-input-section">
              <form onSubmit={makeGuess} className="sp-guess-form">
                <div className="input-wrapper">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Your guess..."
                    className="sp-guess-input"
                    autoFocus
                  />
                  <button type="submit" className="sp-guess-btn">
                    <span>🔍</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="sp-history">
              <div className="sp-player-history">
                <h3>Your Moves</h3>
                <div className="history-list">
                  {guesses.map((g, i) => (
                    <div key={i} className="history-item player">
                      <span className="guess-num">{g.guess}</span>
                      <span className="guess-hint">{g.hint}</span>
                    </div>
                  ))}
                  {guesses.length === 0 && <div className="empty-history">No moves yet</div>}
                </div>
              </div>

              <div className="sp-ai-history">
                <h3>AI Moves</h3>
                <div className="history-list">
                  {aiGuesses.map((g, i) => (
                    <div key={i} className="history-item ai">
                      <span className="guess-num">{g.guess}</span>
                      <span className="guess-hint">{g.hint}</span>
                    </div>
                  ))}
                  {aiGuesses.length === 0 && (
                    <div className="empty-history ai-thinking">
                      <div className="thinking-animation">
                        <div className="brain-wave"></div>
                        <div className="brain-wave"></div>
                        <div className="brain-wave"></div>
                      </div>
                      <span>AI analyzing patterns...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {gameState === 'finished' && gameResult && (
          <div className="sp-result">
            <div className="sp-result-card">
              <div className="result-animation">
                {gameResult.winner === 'player' ? (
                  <div className="victory-animation">
                    <div className="trophy">🏆</div>
                    <div className="confetti"></div>
                  </div>
                ) : (
                  <div className="defeat-animation">
                    <div className="ai-win">
                      <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/mascot-logo-game-template-design-1c342721af365cecf352cc0267426340_screen.jpg?ts=1630305080" alt="AI Victory" className="ai-victory-face-img" />
                      <div className="ai-victory-glow"></div>
                    </div>
                    <div className="digital-sparks">
                      <div className="spark"></div>
                      <div className="spark"></div>
                      <div className="spark"></div>
                      <div className="spark"></div>
                    </div>
                  </div>
                )}
              </div>
              
              <h2 className={gameResult.winner === 'player' ? 'victory' : 'defeat'}>
                {gameResult.winner === 'player' ? '🎉 Victory!' : '💪 Good Fight!'}
              </h2>
              
              <div className="ai-message">
                <div className="ai-speech-bubble">
                  <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/mascot-logo-game-template-design-1c342721af365cecf352cc0267426340_screen.jpg?ts=1630305080" alt="AI" className="ai-avatar-small-img" />
                  <div className="speech-text">
                    {gameResult.winner === 'player' 
                      ? '"Impressive human! Your pattern recognition exceeded my calculations. I shall learn from this defeat."' 
                      : '"My neural networks have processed the optimal solution. Your strategic thinking shows promise, human. Shall we engage again?"'}
                  </div>
                </div>
              </div>
              
              <div className="sp-final-stats">
                <div className="secret-reveal">
                  <span>Secret Number</span>
                  <div className="secret-number">{gameResult.targetNumber}</div>
                </div>
                
                <div className="final-comparison">
                  <div className="final-stat player">
                    <span className="stat-label">Your Guesses</span>
                    <span className="stat-value">{gameResult.playerGuesses}</span>
                  </div>
                  <div className="final-stat ai">
                    <span className="stat-label">AI Guesses</span>
                    <span className="stat-value">{gameResult.aiGuesses}</span>
                  </div>
                </div>
              </div>
              
              <div className="sp-result-actions">
                <button onClick={startGame} className="sp-play-again">
                  <span>🔄</span> Play Again
                </button>
                <Link to="/" className="sp-home-btn">
                  <span>🏠</span> Back to Arena
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePlayer;
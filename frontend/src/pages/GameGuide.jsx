import React from 'react';

const GameGuide = () => {
  return (
    <div className="modern-guide-page">
      <div className="modern-guide-container">
        <div className="modern-guide-header">
          <div className="guide-icon">🎮</div>
          <h1>Game Guide</h1>
          <p>Master the art of number guessing with our comprehensive guide</p>
        </div>

        <div className="modern-guide-grid">
          <div className="modern-guide-card">
            <div className="card-icon">🎯</div>
            <h2>How to Play</h2>
            <div className="steps-container">
              <div className="step-item">
                <span className="step-number">1</span>
                <div className="step-content">
                  <h3>Choose Your Mode</h3>
                  <p>Select between AI Challenge for solo play or Multiplayer Arena for competitive battles</p>
                </div>
              </div>
              <div className="step-item">
                <span className="step-number">2</span>
                <div className="step-content">
                  <h3>Make Your Guess</h3>
                  <p>Enter a number between 1-100 and receive "higher" or "lower" hints</p>
                </div>
              </div>
              <div className="step-item">
                <span className="step-number">3</span>
                <div className="step-content">
                  <h3>Win the Game</h3>
                  <p>Be the first to guess correctly with the fewest attempts to win</p>
                </div>
              </div>
            </div>
          </div>

          <div className="modern-guide-card">
            <div className="card-icon">🤖</div>
            <h2>AI Challenge</h2>
            <div className="feature-list">
              <div className="feature-item">Battle against intelligent AI opponents</div>
              <div className="feature-item">AI adapts its strategy based on your gameplay</div>
              <div className="feature-item">Perfect for practicing and improving skills</div>
              <div className="feature-item">Earn points and climb the leaderboard</div>
            </div>
          </div>

          <div className="modern-guide-card">
            <div className="card-icon">👥</div>
            <h2>Multiplayer Arena</h2>
            <div className="feature-list">
              <div className="feature-item">Compete with up to 4 players simultaneously</div>
              <div className="feature-item">Create private rooms with custom room codes</div>
              <div className="feature-item">Real-time gameplay with live updates</div>
              <div className="feature-item">Chat with other players during matches</div>
            </div>
          </div>

          <div className="modern-guide-card">
            <div className="card-icon">🏆</div>
            <h2>Scoring System</h2>
            <p className="scoring-intro">Points are awarded based on:</p>
            <div className="scoring-grid">
              <div className="scoring-item">Speed of correct guess</div>
              <div className="scoring-item">Number of attempts used</div>
              <div className="scoring-item">Difficulty of the game mode</div>
              <div className="scoring-item">Consecutive wins bonus</div>
            </div>
          </div>

          <div className="modern-guide-card tips-card">
            <div className="card-icon">💡</div>
            <h2>Pro Tips</h2>
            <div className="tips-container">
              <div className="tip-item">
                <h4>Binary Search Strategy</h4>
                <p>Start with 50, then narrow down by half each time for optimal guessing</p>
              </div>
              <div className="tip-item">
                <h4>Pattern Recognition</h4>
                <p>Observe AI behavior patterns to predict its next moves</p>
              </div>
              <div className="tip-item">
                <h4>Speed Matters</h4>
                <p>Quick correct guesses earn bonus points in multiplayer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameGuide;
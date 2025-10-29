import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="logo-animation">
          <img 
            src="https://cdn.svgator.com/images/2021/08/logo-animation-example-conversable.gif" 
            alt="Loading" 
            className="loading-logo"
          />
        </div>
        
        <div className="loading-section">
          <div className="loading-bar-container">
            <div className="loading-bar">
              <div className="loading-progress" style={{ width: '100%' }}></div>
            </div>
            <div className="loading-text">
              <span className="loading-label">Loading</span>
              <div className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
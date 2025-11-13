import React from 'react';
import '../styles/LoadingScreen.css';

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <div className="cisco-icon">
            <div className="network-lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <h1>CCNA 200-301 Course</h1>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p>Loading modules...</p>
      </div>
    </div>
  );
}

export default LoadingScreen;

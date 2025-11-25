import React from 'react';

function LoadingScreen({ status = 'Loading...', progress = 0 }) {
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
        <p className="loading-status">{status}</p>
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;

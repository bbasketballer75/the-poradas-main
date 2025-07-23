import React from 'react';
import './LoadingScreen.css';

function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-content fade-in">
        <div className="loading-spinner" />
        <div className="loading-message script-font">{message}</div>
      </div>
    </div>
  );
}

export default LoadingScreen;

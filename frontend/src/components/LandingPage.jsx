import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onEnter }) => {
  const handleEnter = () => {
    // Enable audio context and start experience
    onEnter();
  };

  return (
    <div className="landing-page">
      <div className="landing-overlay"></div>
      <div className="landing-content">
        <div className="landing-header">
          <h1 className="landing-title">Austin & Jordyn</h1>
          <p className="landing-subtitle">Our Wedding Celebration</p>
          <p className="landing-date">Thank you for celebrating with us</p>
        </div>

        <div className="landing-photo">
          <img
            src="/images/wedding-hero.jpg"
            alt="Austin & Jordyn Wedding"
            className="landing-hero-image"
          />
        </div>

        <button
          className="enter-button"
          onClick={handleEnter}
          aria-label="Enter wedding site with music and video"
        >
          <span className="enter-text">Enter Our Celebration</span>
          <span className="enter-subtitle">Click to enable music & video</span>
        </button>
      </div>
    </div>
  );
};

export default LandingPage;

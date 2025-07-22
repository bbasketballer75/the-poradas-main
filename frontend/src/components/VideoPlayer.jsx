import React from 'react';
import './VideoPlayer.css';

const VideoPlayer = ({ src }) => {
  return (
    <div className="video-container">
      <video controls autoPlay muted loop playsInline className="video-player" data-testid="video-player">
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
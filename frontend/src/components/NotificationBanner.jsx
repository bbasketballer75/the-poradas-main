import React from 'react';
import './NotificationBanner.css';

const NotificationBanner = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="notification-banner" role="status" aria-live="polite">
      <span>{message}</span>
      <button className="notification-close" onClick={onClose} aria-label="Close notification">
        ×
      </button>
    </div>
  );
};

export default NotificationBanner;

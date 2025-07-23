import React, { useState } from 'react';
import './PasswordPrompt.css';

const PasswordPrompt = ({ onCorrectPassword }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd verify this with the backend.
    // For this simple auth, we just store it and let the backend validate.
    onCorrectPassword(password);
  };

  return (
    <div className="password-prompt-container">
      <h2>Admin Access Required</h2>
      <p>Please enter the admin key to continue.</p>
      <form onSubmit={handleSubmit} className="password-form">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin key"
          className="password-input"
          autoFocus
        />
        <button type="submit" className="password-submit-button">
          Unlock
        </button>
      </form>
    </div>
  );
};

export default PasswordPrompt;

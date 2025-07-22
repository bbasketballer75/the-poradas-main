
import React, { useState, useEffect } from 'react';
import { getGuestbookEntries, createGuestbookEntry } from '../services/api';
import './GuestbookPage.css';

const GuestbookPage = () => {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getGuestbookEntries();
        setEntries(response.data);
      } catch (err) {
        setError('Could not load guestbook entries. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);
    if (!message.trim()) {
      setFormError('Message is required.');
      return;
    }
    if (message.length > 500) {
      setFormError('Message cannot exceed 500 characters.');
      return;
    }
    if (name.length > 100) {
      setFormError('Name cannot exceed 100 characters.');
      return;
    }
    setIsSubmitting(true);
    try {
      await createGuestbookEntry({ name, message });
      setName('');
      setMessage('');
      setSuccess('Thank you for signing our guestbook!');
      const response = await getGuestbookEntries();
      setEntries(response.data);
    } catch (err) {
      if (err.response?.data?.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError('Could not submit your message. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="guestbook-page">
      <h2 className="section-title">Digital Guestbook</h2>
      <p className="subheading">Leave us a message! We'd love to hear from you.</p>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} aria-label="Guestbook form">
          <div>
            <label htmlFor="name" className="label">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              maxLength={100}
              aria-label="Your name (optional)"
              autoComplete="name"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="message" className="label">Your Message <span aria-hidden="true" style={{color: 'red'}}>*</span></label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="textarea"
              maxLength={500}
              aria-label="Your message (required)"
              required
              disabled={isSubmitting}
            ></textarea>
          </div>
          {formError && <div className="form-error" role="alert">{formError}</div>}
          {success && <div className="form-success" role="status">{success}</div>}
          <button type="submit" className="button" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Message'}
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="loading" role="status" aria-live="polite">Loading messages...</div>
      ) : error ? (
        <div className="error-message" role="alert">{error}</div>
      ) : (
        <div className="messages" aria-live="polite">
          {entries.length === 0 ? (
            <div className="empty-state" role="status">No messages yet. Be the first to sign our guestbook!</div>
          ) : (
            entries.map((entry) => (
              <div key={entry._id} className="message" tabIndex={0} aria-label={`Message from ${entry.name}`}>
                <p className="message-name">{entry.name}</p>
                <p className="message-text">{entry.message}</p>
                <span className="message-date" aria-label="Date posted">
                  {entry.timestamp && new Date(entry.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default GuestbookPage;
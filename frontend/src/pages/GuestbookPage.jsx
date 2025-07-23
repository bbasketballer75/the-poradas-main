import React, { useState, useEffect } from 'react';
import { getGuestbookEntries, createGuestbookEntry } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import './GuestbookPage.css';

const GuestbookPage = () => {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      try {
        const response = await getGuestbookEntries();
        setEntries(response.data);
      } catch {
        // Could not load guestbook entries. Please try again later.
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntries();
  }, []);

  // Add handleSubmit function if missing
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      if (!message.trim()) {
        setFormError('Message is required.');
        setIsSubmitting(false);
        return;
      }
      await createGuestbookEntry({ name, message });
      setSuccess('Thank you for signing our guestbook!');
      setMessage('');
      setName('');
      // Refresh entries
      const response = await getGuestbookEntries();
      setEntries(response.data);
    } catch {
      setFormError('Could not submit your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="guestbook-page">
      {isLoading && <LoadingScreen message="Loading guestbook..." />}
      {!isLoading && (
        <>
          <h2 className="section-title">Guestbook</h2>
          <p className="guestbook-subheading">
            Leave a message or share your favorite memory from our wedding day. We love reading your
            stories!
          </p>
          <form className="guestbook-form" onSubmit={handleSubmit}>
            <label className="label" htmlFor="name">
              Name (optional)
            </label>
            <input
              className="input"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              placeholder="Your name"
              autoComplete="off"
            />
            <label className="label" htmlFor="message">
              Message
            </label>
            <textarea
              className="textarea"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              placeholder="Share your favorite memory or a message for the couple!"
              required
            />
            {formError && (
              <div className="form-error" role="alert">
                {formError}
              </div>
            )}
            {success && (
              <div className="form-success" role="status">
                {success}
              </div>
            )}
            <button className="button" type="submit" disabled={isSubmitting}>
              Sign Guestbook
            </button>
          </form>
          <div className="messages">
            {entries.length === 0 ? (
              <div className="empty-state">No messages yet. Be the first to share a memory!</div>
            ) : (
              entries.map((entry) => (
                <div className="message" key={entry._id}>
                  <div className="message-name">{entry.name || 'Anonymous'}</div>
                  <div className="message-text">{entry.message}</div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GuestbookPage;

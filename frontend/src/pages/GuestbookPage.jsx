
import React, { useState, useEffect } from 'react';
import { getGuestbookEntries, createGuestbookEntry } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
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
    try {
      await createGuestbookEntry({ name, message });
      setName('');
      setMessage('');
      setSuccess('Thank you for signing our guestbook!');
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
      {(isLoading || isSubmitting) && <LoadingScreen message={isSubmitting ? 'Submitting your message...' : 'Loading guestbook...'} />}
      {!isLoading && !isSubmitting && (
        error ? (
          <div className="error-message" role="alert">{error}</div>
        ) : (
          <>
            <h2 className="section-title">Sign Our Guestbook</h2>
            <form className="guestbook-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
              />
              <textarea
                placeholder="Leave a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                required
              />
              {formError && <div className="form-error" role="alert">{formError}</div>}
              {success && <div className="form-success" role="status">{success}</div>}
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Sign Guestbook'}
              </button>
            </form>
            <div className="guestbook-entries">
              {entries.map((entry) => (
                <div key={entry._id} className="guestbook-entry">
                  <div className="entry-header">
                    <span className="entry-name">{entry.name || 'Anonymous'}</span>
                    <span className="entry-date">{new Date(entry.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="entry-message">{entry.message}</div>
                </div>
              ))}
            </div>
          </>
        )
      )}
    </div>
  );
};

export default GuestbookPage;
import React, { useState, useEffect } from 'react';
import { getGuestbookEntries, addGuestbookEntry } from '../services/api';
import './GuestbookPage.css';

const GuestbookPage = () => {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEntries = async () => {
      const response = await getGuestbookEntries();
      setEntries(response.data);
    };
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && message) {
      await addGuestbookEntry({ name, message });
      setName('');
      setMessage('');
      const response = await getGuestbookEntries();
      setEntries(response.data);
    }
  };

  return (
    <div className="guestbook-page">
      <h2 className="section-title">Digital Guestbook</h2>
      <p className="subheading">Leave us a message! We'd love to hear from you.</p>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="label">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="message" className="label">Your Message</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="textarea"
            ></textarea>
          </div>
          <button type="submit" className="button">Submit Message</button>
        </form>
      </div>

      <div className="messages">
        {entries.map((entry) => (
          <div key={entry._id} className="message">
            <p className="message-name">{entry.name}</p>
            <p className="message-text">{entry.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestbookPage;
import React, { useState, useEffect } from 'react';
import { getAllAlbumMedia, moderateMedia } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = ({ adminKey }) => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllMedia = async () => {
    try {
      setIsLoading(true);
        const response = await getAllAlbumMedia(adminKey);
      setMedia(response.data);
      setError(null);
    } catch (err) {
        setError(err.response?.data?.message || 'Could not fetch media. Is the admin key correct?');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

    fetchAllMedia();
  }, [adminKey]);

  const handleModeration = async (photoId, isApproved) => {
    try {
      await moderateMedia(photoId, isApproved, adminKey);
      // Update the state locally to reflect the change immediately
      setMedia((prevMedia) =>
        prevMedia.map((item) =>
          item._id === photoId ? { ...item, approved: isApproved } : item
        )
      );
    } catch (err) {
      alert('Failed to update status. Please try again.');
      console.error('Moderation failed:', err);
    }
  };

  if (isLoading) return <p>Loading submissions...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="admin-dashboard">
      {media.length === 0 ? (
        <p>No submissions to moderate.</p>
      ) : (
        media.map((item) => (
          <div key={item._id} className={`moderation-card ${item.approved ? 'is-approved' : 'is-pending'}`}>
            <div className="media-preview">
              {item.mimetype.startsWith('image/') && <img src={item.filepath} alt="Submission" />}
              {item.mimetype.startsWith('video/') && <video src={item.filepath} controls muted loop />}
            </div>
            <div className="moderation-info">
              <p>
                <strong>Status:</strong> {item.approved ? 'Approved' : 'Pending Approval'}
              </p>
              <p>
                <strong>Uploaded by:</strong> {item.uploadedBy}
              </p>
              <p>
                <strong>Date:</strong> {new Date(item.timestamp).toLocaleDateString()}
              </p>
            </div>
            <div className="moderation-actions">
              <button onClick={() => handleModeration(item._id, true)} disabled={item.approved} className="approve-button">
                Approve
              </button>
              <button onClick={() => handleModeration(item._id, false)} disabled={!item.approved} className="deny-button">
                Deny
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;
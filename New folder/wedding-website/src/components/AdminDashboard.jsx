import React, { useState, useEffect } from 'react';
import { getAllAlbumMedia, moderateMedia } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = ({ adminKey }) => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modAction, setModAction] = useState({}); // { [id]: 'pending' | 'success' | 'error' }

  useEffect(() => {
    const fetchAllMedia = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAllAlbumMedia(adminKey);
        setMedia(response.data);
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
    setModAction((prev) => ({ ...prev, [photoId]: 'pending' }));
    setSuccess(null);
    try {
      await moderateMedia(photoId, isApproved, adminKey);
      setMedia((prevMedia) =>
        prevMedia.map((item) => (item._id === photoId ? { ...item, approved: isApproved } : item))
      );
      setModAction((prev) => ({ ...prev, [photoId]: 'success' }));
      setSuccess(isApproved ? 'Media approved.' : 'Media denied and removed.');
    } catch (err) {
      setModAction((prev) => ({ ...prev, [photoId]: 'error' }));
      setError('Failed to update status. Please try again.');
      console.error('Moderation failed:', err);
    }
  };

  if (isLoading)
    return (
      <div className="loading" role="status" aria-live="polite">
        Loading submissions...
      </div>
    );
  if (error)
    return (
      <div className="error-message" role="alert">
        {error}
      </div>
    );

  return (
    <div className="admin-dashboard" aria-label="Admin moderation dashboard">
      {success && (
        <div className="form-success" role="status">
          {success}
        </div>
      )}
      {media.length === 0 ? (
        <div className="empty-state" role="status">
          No submissions to moderate.
        </div>
      ) : (
        media.map((item) => (
          <div
            key={item._id}
            className={`moderation-card ${item.approved ? 'is-approved' : 'is-pending'}`}
            tabIndex={0}
            aria-label={`Submission by ${item.uploadedBy}, status: ${item.approved ? 'approved' : 'pending'}`}
          >
            <div className="media-preview">
              {item.mimetype.startsWith('image/') && (
                <picture>
                  <source srcSet={item.filepath.replace(/\.(jpg|jpeg|png)$/i, '.webp')} type="image/webp" />
                  <source srcSet={item.filepath} type="image/jpeg" />
                  <img
                    src={item.filepath}
                    alt="Submission preview"
                    loading="lazy"
                    width="400"
                    height="300"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </picture>
              )}
              {item.mimetype.startsWith('video/') && (
                <video
                  src={item.filepath}
                  controls
                  muted
                  loop
                  aria-label="Submission video preview"
                />
              )}
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
              <button
                onClick={() => handleModeration(item._id, true)}
                disabled={item.approved || modAction[item._id] === 'pending'}
                className="approve-button"
                aria-busy={modAction[item._id] === 'pending'}
                aria-label={`Approve submission by ${item.uploadedBy}`}
              >
                {modAction[item._id] === 'pending' ? 'Approving...' : 'Approve'}
              </button>
              <button
                onClick={() => handleModeration(item._id, false)}
                disabled={!item.approved || modAction[item._id] === 'pending'}
                className="deny-button"
                aria-busy={modAction[item._id] === 'pending'}
                aria-label={`Deny submission by ${item.uploadedBy}`}
              >
                {modAction[item._id] === 'pending' ? 'Denying...' : 'Deny'}
              </button>
              {modAction[item._id] === 'error' && (
                <span className="error-message" role="alert">
                  Failed to update. Try again.
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;

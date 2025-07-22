import React, { useState, useEffect } from 'react';
import { getAlbumMedia } from '../services/api';
import './PhotoGallery.css';

const PhotoGallery = ({ refreshKey }) => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setIsLoading(true);
        const response = await getAlbumMedia();
        setMedia(response.data);
        setError(null);
      } catch (err) {
        setError('Could not fetch the album. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
  }, [refreshKey]); // Refreshes when the key changes

  if (isLoading) {
    return <p>Loading album...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="photo-gallery">
      {media.length === 0 ? (
        <p>The album is currently empty. Be the first to contribute!</p>
      ) : (
        media.map((item) => (
          <div key={item._id} className="gallery-item">
            {item.mimetype.startsWith('image/') && <img src={item.filepath} alt="Wedding album" loading="lazy" />}
            {item.mimetype.startsWith('video/') && <video src={item.filepath} controls muted loop playsInline />}
          </div>
        ))
      )}
    </div>
  );
};

export default PhotoGallery;
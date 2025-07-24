import React, { useState, useEffect } from 'react';
import { getAlbumMedia, uploadMedia } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';

import './AlbumPage.css';

const AlbumPage = () => {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      setIsLoading(true);
      const response = await getAlbumMedia();
      setPhotos(response.data);
      setIsLoading(false);
    };
    fetchPhotos();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('photo', file);
      await uploadMedia(formData);
      setFile(null);
      const response = await getAlbumMedia();
      setPhotos(response.data);
      setIsUploading(false);
    }
  };

  return (
    <div className="album-page">
      {(isLoading || isUploading) && (
        <LoadingScreen message={isUploading ? 'Uploading photo...' : 'Loading album...'} />
      )}
      {!isLoading && !isUploading && (
        <>
          <h2 className="section-title">Photo & Video Album</h2>
          <p className="album-subheading">
            Share your favorite moments! Upload your photos and videos from the wedding, or browse
            memories from others below.
          </p>
          <div className="upload-section">
            <label htmlFor="album-upload-input" className="visually-hidden">
              Upload your wedding photo or video
            </label>
            <input
              id="album-upload-input"
              type="file"
              onChange={handleFileChange}
              aria-label="Upload your wedding photo or video"
            />
            <button onClick={handleUpload} className="btn accent">
              Upload Photo
            </button>
          </div>
          <div className="photo-grid">
            {photos.map((photo) => (
              <div key={photo._id} className="photo-card">
                {photo.webpPath && photo.jpegPath ? (
                  <picture>
                    <source srcSet={`/${photo.webpPath}`} type="image/webp" />
                    <source srcSet={`/${photo.jpegPath}`} type="image/jpeg" />
                    <img src={`/${photo.jpegPath}`} alt="Wedding memory" loading="lazy" />
                  </picture>
                ) : (
                  <img src={`/uploads/${photo.filename}`} alt="Wedding memory" loading="lazy" />
                )}
                <a
                  href={photo.jpegPath ? `/${photo.jpegPath}` : `/uploads/${photo.filename}`}
                  download
                  className="btn secondary download-btn"
                  aria-label="Download photo"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AlbumPage;

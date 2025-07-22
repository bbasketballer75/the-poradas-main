import React, { useState, useEffect } from 'react';
import { getAlbumMedia, uploadMedia } from '../services/api';
import './AlbumPage.css';

const AlbumPage = () => {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      const response = await getAlbumMedia();
      setPhotos(response.data);
    };
    fetchPhotos();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('photo', file);
      await uploadMedia(formData);
      setFile(null);
      const response = await getAlbumMedia();
      setPhotos(response.data);
    }
  };

  return (
    <div className="album-page">
      <h2 className="section-title">Photo & Video Album</h2>
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload Photo</button>
      </div>
      <div className="photo-grid">
        {photos.map((photo) => (
          <div key={photo._id} className="photo-card">
            <img src={`/uploads/${photo.filename}`} alt={photo.filename} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumPage;
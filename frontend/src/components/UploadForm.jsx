import React, { useState } from 'react';
import { uploadMedia } from '../services/api';
import './UploadForm.css';

const UploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('media', file);

    setIsUploading(true);
    setError('');
    setMessage('');

    try {
      await uploadMedia(formData);
      setMessage('Thank you! Your file has been uploaded and is awaiting approval.');
      setFile(null);
      e.target.reset(); // Reset the form input
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Upload failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-form-container">
      <h2>Contribute to Our Album</h2>
      <p>Share your favorite moments from our special day!</p>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*,video/*" className="file-input" />
        <button type="submit" disabled={isUploading} className="upload-button">
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default UploadForm;
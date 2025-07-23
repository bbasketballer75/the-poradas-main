import React, { useEffect, useRef, useState } from 'react';
import './VideoModal.css';

function VideoModal({ videoUrl, onClose }) {
  const [loading, setLoading] = useState(true);
  const closeBtnRef = useRef();
  const modalRef = useRef();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    closeBtnRef.current && closeBtnRef.current.focus();
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Focus trap for accessibility
  useEffect(() => {
    const trap = (e) => {
      if (!modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };
    window.addEventListener('keydown', trap);
    return () => window.removeEventListener('keydown', trap);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Click outside to close
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('video-modal-overlay')) onClose();
  };

  // Hide spinner when iframe loads
  const handleIframeLoad = () => setLoading(false);

  return (
    <div className="video-modal-overlay fade-in" onClick={handleOverlayClick} aria-modal="true" role="dialog" ref={modalRef}>
      <div className="video-modal-content scale-in">
        <button className="video-modal-close" onClick={onClose} aria-label="Close video" ref={closeBtnRef}>×</button>
        {loading && <div className="video-modal-spinner loading-spinner" aria-label="Loading video" />}
        <iframe
          src={videoUrl + '?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0'}
          title="Parent Video"
          allow="autoplay; encrypted-media"
          allowFullScreen
          frameBorder="0"
          className="video-modal-iframe"
          style={loading ? { visibility: 'hidden' } : {}}
          onLoad={handleIframeLoad}
          tabIndex={0}
        />
      </div>
    </div>
  );
}

export default VideoModal;

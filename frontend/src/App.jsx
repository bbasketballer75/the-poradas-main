import React, { useEffect, useState, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { logVisit } from './services/api';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './components/LandingPage';
import MusicPlayer from './components/MusicPlayer';
import NotificationBanner from './components/NotificationBanner';
import OrientationOverlay from './components/OrientationOverlay';
import './App.css';

// Code splitting: Lazy load heavy components
const OnePage = React.lazy(() => import('./OnePage'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));

function App() {
  const [loading, setLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [notification, setNotification] = useState('');
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    logVisit()
      .catch(console.error)
      .finally(() => setTimeout(() => setLoading(false), 800));
  }, []);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  // Handler for entering the site from the landing page
  const handleEnter = () => {
    setShowLanding(false);
    setMusicEnabled(true);
    setNotification('Welcome! Enjoy the music and explore the memories.');
  };

  return (
    <div className="App">
      <OrientationOverlay />
      {loading && <LoadingScreen message="Loading..." />}
      {!loading && showLanding && <LandingPage onEnter={handleEnter} />}
      {!loading && !showLanding && (
        <>
          <NotificationBanner message={notification} onClose={() => setNotification('')} />
          <MusicPlayer isEnabled={musicEnabled} position="bottom-left" />
          <Suspense fallback={<LoadingScreen message="Loading page..." />}>
            <Routes>
              <Route path="/" element={<OnePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </Suspense>
        </>
      )}
    </div>
  );
}

export default App;

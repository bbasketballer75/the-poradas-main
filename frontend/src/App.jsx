import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import OrientationOverlay from './components/OrientationOverlay';
import HomePage from './pages/HomePage';
import AlbumPage from './pages/AlbumPage';
import GuestbookPage from './pages/GuestbookPage';
import MapPage from './pages/MapPage';
import FamilyTreePage from './pages/FamilyTreePage';
import AdminPage from './pages/AdminPage';
import WeddingPartyPage from './pages/WeddingPartyPage';
import { logVisit } from './services/api';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

function App() {
  // Log the site visit once when the component mounts
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    logVisit().catch(console.error).finally(() => setTimeout(() => setLoading(false), 800));
  }, []);

  // Show loading screen briefly on route change for a smooth transition
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <div className="App">
      <OrientationOverlay />
      <Navbar />
      <main className="container">
        {loading && <LoadingScreen message="Loading..." />}
        {!loading && (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/album" element={<AlbumPage />} />
            <Route path="/guestbook" element={<GuestbookPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/family-tree" element={<FamilyTreePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/wedding-party" element={<WeddingPartyPage />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;

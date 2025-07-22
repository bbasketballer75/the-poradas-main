import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AlbumPage from './pages/AlbumPage';
import GuestbookPage from './pages/GuestbookPage';
import MapPage from './pages/MapPage';
import FamilyTreePage from './pages/FamilyTreePage';
import AdminPage from './pages/AdminPage';
import WeddingPartyPage from './pages/WeddingPartyPage';
import { logVisit } from './services/api';
import './App.css';

function App() {
  // Log the site visit once when the component mounts
  useEffect(() => {
    logVisit().catch(console.error); // Log visit and catch any potential errors
  }, []);

  return (
    <div className="App">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/album" element={<AlbumPage />} />
          <Route path="/guestbook" element={<GuestbookPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/family-tree" element={<FamilyTreePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/wedding-party" element={<WeddingPartyPage />} />
        </Routes>
      </main>
    </div>  );
}

export default App;

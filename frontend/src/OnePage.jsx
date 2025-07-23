import StayInTouchSection from './components/StayInTouchSection';
import React, { useEffect } from 'react';
import { setupSectionFadeIn } from './scrollFadeIn';
import Navbar from './components/Navbar';
import ThankYouSection from './components/ThankYouSection';
import WeddingHighlightsSection from './components/WeddingHighlightsSection';
import MemoryWall from './components/MemoryWall';
import KeepsakesSection from './components/KeepsakesSection';
import TimelineSection from './components/TimelineSection';
import HomePage from './pages/HomePage';
import AlbumPage from './pages/AlbumPage';
import GuestbookPage from './pages/GuestbookPage';
import MapPage from './pages/MapPage';
import FamilyTreePage from './pages/FamilyTreePage';
import WeddingPartyPage from './pages/WeddingPartyPage';
import './App.css';

const OnePage = () => {
  useEffect(() => {
    setupSectionFadeIn();
  }, []);
  return (
    <div className="App">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar onePage />
      <main className="onepage-main" id="main-content" role="main" aria-label="Main content">
        <ThankYouSection />
        <WeddingHighlightsSection />
        <section id="memorywall" aria-label="Memory Wall and Photo Booth" role="region">
          <MemoryWall />
        </section>
        <section id="keepsakes" aria-label="Downloadable Keepsakes" role="region">
          <KeepsakesSection />
        </section>
        <section id="timeline" aria-label="Wedding Day Timeline" role="region">
          <TimelineSection />
        </section>
        <section id="home" aria-label="Home" role="region">
          <HomePage onePage />
        </section>
        <section id="album" aria-label="Album" role="region">
          <AlbumPage onePage />
        </section>
        <section id="guestbook" aria-label="Guestbook" role="region">
          <GuestbookPage onePage />
        </section>
        <section id="map" aria-label="Map" role="region">
          <MapPage onePage />
        </section>
        <section id="family" aria-label="Family Tree" role="region">
          <FamilyTreePage onePage />
        </section>
        <section id="party" aria-label="Wedding Party" role="region">
          <WeddingPartyPage onePage />
        </section>
        <StayInTouchSection />
      </main>
    </div>
  );
};

export default OnePage;

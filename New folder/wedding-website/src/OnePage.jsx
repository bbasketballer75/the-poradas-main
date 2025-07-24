import React, { useEffect, Suspense } from 'react';
import { setupSectionFadeIn } from './scrollFadeIn';
import Navbar from './components/Navbar';
import ThankYouSection from './components/ThankYouSection';
import WeddingHighlightsSection from './components/WeddingHighlightsSection';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

// Lazy load heavy components
const MemoryWall = React.lazy(() => import('./components/MemoryWall'));
const KeepsakesSection = React.lazy(() => import('./components/KeepsakesSection'));
const TimelineSection = React.lazy(() => import('./components/TimelineSection'));
const StayInTouchSection = React.lazy(() => import('./components/StayInTouchSection'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const AlbumPage = React.lazy(() => import('./pages/AlbumPage'));
const GuestbookPage = React.lazy(() => import('./pages/GuestbookPage'));
const MapPage = React.lazy(() => import('./pages/MapPage'));
const FamilyTreePage = React.lazy(() => import('./pages/FamilyTreePage'));
const WeddingPartyPage = React.lazy(() => import('./pages/WeddingPartyPage'));

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
        <Suspense fallback={<LoadingScreen message="Loading section..." />}>
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
        </Suspense>
      </main>
    </div>
  );
};

export default OnePage;

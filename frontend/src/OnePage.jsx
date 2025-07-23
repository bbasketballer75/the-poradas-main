import StayInTouchSection from './components/StayInTouchSection';
import React, { useEffect } from 'react';
import { setupSectionFadeIn } from './scrollFadeIn';
import Navbar from './components/Navbar';
import OrientationOverlay from './components/OrientationOverlay';
import ThankYouSection from './components/ThankYouSection';
import WeddingHighlightsSection from './components/WeddingHighlightsSection';
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
      <OrientationOverlay />
      <Navbar onePage />
      <main className="onepage-main">
        <ThankYouSection />
        <WeddingHighlightsSection />
        <section id="home"><HomePage onePage /></section>
        <section id="album"><AlbumPage onePage /></section>
        <section id="guestbook"><GuestbookPage onePage /></section>
        <section id="map"><MapPage onePage /></section>
        <section id="family"><FamilyTreePage onePage /></section>
        <section id="party"><WeddingPartyPage onePage /></section>
        <StayInTouchSection />
      </main>
    </div>
  );
};

export default OnePage;

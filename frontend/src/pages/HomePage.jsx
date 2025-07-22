import React from 'react';
import { Link } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import { getVideoUrl } from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const videoSrc = getVideoUrl();

  return (
    <div className="home-page">
      <header className="hero-section text-center">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="display-4">Austin & Jordyn</h1>
          <p className="lead">Welcome to Our Wedding Celebration</p>
        </div>
      </header>

      <main>
        <section className="video-section text-center">
          <h2 className="section-title">Our Wedding Video</h2>
          <div className="video-container">
            <VideoPlayer src={videoSrc} />
          </div>
        </section>

        <section className="our-story-section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h2 className="section-title">Our Story</h2>
                <p>
                  From a chance meeting at a coffee shop to a lifetime of love.
                  Our journey has been filled with laughter, adventure, and unwavering support for one another.
                  We're thrilled to share our special day with you.
                </p>
                <p>
                  We are so incredibly excited to start this next chapter of our lives
                  as husband and wife, and we feel so blessed to be able to share this
                  momentous occasion with you, our cherished friends and family.
                </p>
              </div>
              <div className="col-lg-6 text-center">
                <img src="/images/engagement.jpg" alt="Our Engagement" className="img-fluid rounded-circle shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        <section className="explore-section text-center">
          <div className="container">
            <h2 className="section-title">Explore Our Site</h2>
            <div className="row">
              <div className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title">Photo & Video Album</h3>
                    <p className="card-text">View photos from our special day and upload your own memories.</p>
                    <Link to="/album" className="btn btn-primary">View Album</Link>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title">Digital Guestbook</h3>
                    <p className="card-text">Leave us a message to commemorate the occasion.</p>
                    <Link to="/guestbook" className="btn btn-primary">Sign Guestbook</Link>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title">Visitor Map</h3>
                    <p className="card-text">See where all of our wonderful guests are joining from.</p>
                    <Link to="/map" className="btn btn-primary">View Map</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
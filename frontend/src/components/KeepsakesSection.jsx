import React from 'react';
import './KeepsakesSection.css';

const keepsakes = [
  {
    title: 'Wedding Program',
    file: '/downloads/wedding-program.pdf',
    description: 'Download the official wedding program as a keepsake.',
  },
  {
    title: 'Thank You Card',
    file: '/downloads/thank-you-card.jpg',
    description: 'A digital thank you card from us to you.',
  },
  {
    title: 'Favorite Photos',
    file: '/downloads/favorite-photos.zip',
    description: 'A curated set of our favorite wedding photos.',
  },
];

const KeepsakesSection = () => (
  <section id="keepsakes" className="keepsakes-section">
    <h2 className="keepsakes-title">Downloadable Keepsakes</h2>
    <div className="keepsakes-grid">
      {keepsakes.map((item, idx) => (
        <div className="keepsake-card" key={idx}>
          <h3 className="keepsake-title">{item.title}</h3>
          <p className="keepsake-desc">{item.description}</p>
          <a href={item.file} download className="keepsake-download-btn">
            Download
          </a>
        </div>
      ))}
    </div>
  </section>
);

export default KeepsakesSection;

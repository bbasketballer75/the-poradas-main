
import React, { useState } from 'react';
import VideoModal from '../components/VideoModal';
import './FamilyTreePage.css';


const PARENT_VIDEOS = [
  {
    name: "Jerame",
    display: "Jerame (Jordyn's Dad)",
    relation: "Father of the Bride",
    image: "/images/parents/jerame.webp",
    video: "https://www.youtube.com/embed/4eN1UNG7NjQ"
  },
  {
    name: "Heather",
    display: "Heather (Austin's Mom)",
    relation: "Mother of the Groom",
    image: "/images/parents/heather.webp",
    video: "https://www.youtube.com/embed/C22dgo_w4Oo"
  },
  {
    name: "Melony",
    display: "Melony (Austin's Mom)",
    relation: "Mother of the Groom",
    image: "/images/parents/melony.webp",
    video: "https://www.youtube.com/embed/BAY3F9Yi9s0"
  },
  {
    name: "Christine",
    display: "Christine (Jordyn's Mom)",
    relation: "Mother of the Bride",
    image: "/images/parents/christine.webp",
    video: "https://www.youtube.com/embed/rvXBYiBEaSM"
  }
];

const FamilyTreePage = () => {
  const [modalVideo, setModalVideo] = useState(null);

  return (
    <div className="family-tree-page">
      <h2 className="section-title">Our Families</h2>
      <div className="family-grid">
        {PARENT_VIDEOS.map((parent) => (
          <div
            key={parent.name}
            className="family-member-card family-member-card-clickable"
            tabIndex={0}
            role="button"
            aria-label={`Play video for ${parent.display}`}
            onClick={() => setModalVideo(parent.video)}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setModalVideo(parent.video)}
          >
            <img src={parent.image} alt={parent.display} className="family-member-image" />
            <h4 className="family-member-name">{parent.display}</h4>
            <p className="family-member-relation">{parent.relation}</p>
            <span className="family-member-play-btn" aria-hidden="true">▶</span>
          </div>
        ))}
      </div>
      {modalVideo && (
        <VideoModal videoUrl={modalVideo} onClose={() => setModalVideo(null)} />
      )}
    </div>
  );
};

export default FamilyTreePage;

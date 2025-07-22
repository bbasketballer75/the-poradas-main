
import React from 'react';
import './FamilyTreePage.css';

const FamilyTreePage = () => {
  const parents = [
    { name: 'Jerame & Melony', relation: 'Parents of the Groom', image: '/images/parents/jerame.webp' },
    { name: 'Heather & Christine', relation: 'Parents of the Bride', image: '/images/parents/heather.webp' },
  ];

  return (
    <div className="family-tree-page">
      <h2 className="section-title">Our Families</h2>
      <div className="family-grid">
        {parents.map((parent) => (
          <div key={parent.name} className="family-member-card">
            <img src={parent.image} alt={parent.name} className="family-member-image" />
            <h4 className="family-member-name">{parent.name}</h4>
            <p className="family-member-relation">{parent.relation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyTreePage;

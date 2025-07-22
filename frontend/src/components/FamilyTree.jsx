import React from 'react';
import './FamilyTree.css';

// Helper component for rendering each family member
const Member = ({ person }) => (
  <div className="member">
    <div className="member-card">
      <div className="member-name">{person.name}</div>
      <div className="member-role">{person.role}</div>
    </div>
    {person.children && person.children.length > 0 && (
      <div className="children">
        {person.children.map((child) => (
          <Member key={child.name} person={child} />
        ))}
      </div>
    )}
  </div>
);

// Main Family Tree component
const FamilyTree = () => {
  // Family data can be easily updated here
  const familyData = {
    name: 'The Porada & Smith Elders',
    role: 'Grandparents',
    children: [
      {
        name: 'John & Jane Porada',
        role: 'Parents of the Groom',
        children: [
          {
            name: 'Austin Porada',
            role: 'Groom',
            children: [],
          },
        ],
      },
      {
        name: 'Robert & Mary Smith',
        role: 'Parents of the Bride',
        children: [
          {
            name: 'Emily Smith',
            role: 'Bride',
            children: [],
          },
        ],
      },
    ],
  };

  return (
    <div className="family-tree-container">
      <div className="family-tree">
        <Member person={familyData} />
      </div>
    </div>
  );
};

export default FamilyTree;
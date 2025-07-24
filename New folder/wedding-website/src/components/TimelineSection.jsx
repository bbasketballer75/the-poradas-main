import React from 'react';
import './TimelineSection.css';

const timeline = [
  {
    time: '3:00 PM',
    title: 'Ceremony',
    description: 'Join us for the wedding ceremony at the garden.',
  },
  {
    time: '4:00 PM',
    title: 'Cocktail Hour',
    description: 'Enjoy drinks and appetizers with us.',
  },
  {
    time: '5:00 PM',
    title: 'Reception',
    description: 'Dinner, dancing, and celebration!',
  },
  {
    time: '8:00 PM',
    title: 'Send-Off',
    description: 'Help us send off the happy couple.',
  },
];

const TimelineSection = () => (
  <section id="timeline" className="timeline-section">
    <h2 className="timeline-title">Wedding Day Timeline</h2>
    <div className="timeline-list">
      {timeline.map((item, idx) => (
        <div className="timeline-item" key={idx}>
          <div className="timeline-time">{item.time}</div>
          <div className="timeline-content">
            <div className="timeline-event">{item.title}</div>
            <div className="timeline-desc">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default TimelineSection;

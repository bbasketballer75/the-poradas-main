import React from 'react';
import { render, screen } from '@testing-library/react';

import TimelineSection from './TimelineSection';

describe('TimelineSection', () => {
  test('renders timeline section with title', () => {
    render(<TimelineSection />);
    expect(screen.getByText('Wedding Day Timeline')).toBeInTheDocument();
  });

  test('displays all timeline events', () => {
    render(<TimelineSection />);

    expect(screen.getByText('3:00 PM')).toBeInTheDocument();
    expect(screen.getByText('4:00 PM')).toBeInTheDocument();
    expect(screen.getByText('5:00 PM')).toBeInTheDocument();
    expect(screen.getByText('8:00 PM')).toBeInTheDocument();

    expect(screen.getByText('Ceremony')).toBeInTheDocument();
    expect(screen.getByText('Cocktail Hour')).toBeInTheDocument();
    expect(screen.getByText('Reception')).toBeInTheDocument();
    expect(screen.getByText('Send-Off')).toBeInTheDocument();
  });

  test('shows descriptions for each timeline event', () => {
    render(<TimelineSection />);

    expect(screen.getByText('Join us for the wedding ceremony at the garden.')).toBeInTheDocument();
    expect(screen.getByText('Enjoy drinks and appetizers with us.')).toBeInTheDocument();
    expect(screen.getByText('Dinner, dancing, and celebration!')).toBeInTheDocument();
    expect(screen.getByText('Help us send off the happy couple.')).toBeInTheDocument();
  });

  test('has correct timeline structure', () => {
    render(<TimelineSection />);

    // Should have 4 timeline items
    const timelineItems = screen.getAllByText(/PM$/);
    expect(timelineItems).toHaveLength(4);
  });
});

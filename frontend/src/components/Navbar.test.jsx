
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { describe, it, expect } from 'vitest';

describe('Navbar', () => {
  it('renders the navbar with brand and links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Check for the brand name
    expect(screen.getByText('Austin & Jordyn')).toBeInTheDocument();

    // Check for a few links
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Album')).toBeInTheDocument();
    expect(screen.getByText('Guestbook')).toBeInTheDocument();
  });
});

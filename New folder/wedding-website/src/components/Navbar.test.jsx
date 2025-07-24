import React from 'react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('renders logo and tagline', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText(/Austin & Jordyn/i)).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Family Tree/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Album/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Guestbook/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Map/i })).toBeInTheDocument();
  });

  it('opens and closes mobile menu', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const toggle = screen.getByLabelText(/Toggle navigation/i);
    fireEvent.click(toggle);
    expect(screen.getByRole('navigation')).toBeVisible();
    fireEvent.click(toggle);
    expect(screen.getByRole('navigation')).toBeVisible(); // Should remain visible for accessibility
  });

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

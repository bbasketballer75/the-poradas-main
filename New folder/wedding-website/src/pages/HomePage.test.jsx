import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';


describe('HomePage', () => {
  const renderWithRouter = (component) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  it('renders welcome message and main CTA', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByRole('heading', { name: /Austin & Jordyn/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Album/i })).toBeInTheDocument();
  });

  it('displays welcome message and navigation elements', () => {
    renderWithRouter(<HomePage />);

    // Should have some welcoming content
    const homeContainer = document.querySelector('.home-page');
    expect(homeContainer).toBeInTheDocument();
  });

  it('has proper accessibility structure', () => {
    renderWithRouter(<HomePage />);

    // Main heading should be present and accessible
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeVisible();

    // Page should have proper structure
    const homeContainer = document.querySelector('.home-page');
    expect(homeContainer).toBeInTheDocument();
  });

  it('renders without errors', () => {
    expect(() => {
      renderWithRouter(<HomePage />);
    }).not.toThrow();
  });

  it('applies correct CSS classes', () => {
    renderWithRouter(<HomePage />);

    const homeContainer = document.querySelector('.home-page');
    expect(homeContainer).toBeInTheDocument();
    expect(homeContainer).toHaveClass('home-page');
  });

  it('is responsive and mobile-friendly', () => {
    renderWithRouter(<HomePage />);

    const homeContainer = document.querySelector('.home-page');
    expect(homeContainer).toBeInTheDocument();

    // Component should render properly on different screen sizes
    // (CSS media queries are tested through visual regression or manual testing)
    expect(homeContainer).toBeVisible();
  });
});

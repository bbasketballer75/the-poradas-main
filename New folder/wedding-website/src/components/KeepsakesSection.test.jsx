import React from 'react';
import { render, screen } from '@testing-library/react';

import KeepsakesSection from './KeepsakesSection';

describe('KeepsakesSection', () => {
  test('renders keepsakes section with title', () => {
    render(<KeepsakesSection />);
    expect(screen.getByText('Downloadable Keepsakes')).toBeInTheDocument();
  });

  test('displays all keepsake items', () => {
    render(<KeepsakesSection />);

    expect(screen.getByText('Wedding Program')).toBeInTheDocument();
    expect(screen.getByText('Thank You Card')).toBeInTheDocument();
    expect(screen.getByText('Favorite Photos')).toBeInTheDocument();
  });

  test('shows descriptions for each keepsake', () => {
    render(<KeepsakesSection />);

    expect(
      screen.getByText('Download the official wedding program as a keepsake.')
    ).toBeInTheDocument();
    expect(screen.getByText('A digital thank you card from us to you.')).toBeInTheDocument();
    expect(screen.getByText('A curated set of our favorite wedding photos.')).toBeInTheDocument();
  });

  test('has download links for all keepsakes', () => {
    render(<KeepsakesSection />);

    const downloadLinks = screen.getAllByRole('link', { name: /download/i });
    expect(downloadLinks).toHaveLength(3);

    expect(downloadLinks[0]).toHaveAttribute('href', '/downloads/wedding-program.pdf');
    expect(downloadLinks[1]).toHaveAttribute('href', '/downloads/thank-you-card.jpg');
    expect(downloadLinks[2]).toHaveAttribute('href', '/downloads/favorite-photos.zip');
  });

  test('download links have download attribute', () => {
    render(<KeepsakesSection />);

    const downloadLinks = screen.getAllByRole('link', { name: /download/i });
    downloadLinks.forEach((link) => {
      expect(link).toHaveAttribute('download');
    });
  });
});

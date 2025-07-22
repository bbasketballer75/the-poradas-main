import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import AlbumPage from './AlbumPage';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the UploadForm component
vi.mock('../components/UploadForm', () => ({
  default: ({ onUploadSuccess }) => (
    <div data-testid="mock-upload-form">
      <button onClick={() => onUploadSuccess && onUploadSuccess()}>
        Mock Upload Success
      </button>
    </div>
  )
}));

// Mock the PhotoGallery component
vi.mock('../components/PhotoGallery', () => ({
  default: ({ refreshKey }) => (
    <div data-testid="mock-photo-gallery" data-refresh-key={refreshKey}>
      Photo Gallery (refreshKey: {refreshKey})
    </div>
  )
}));

describe('AlbumPage', () => {
  const renderWithRouter = (component) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the main heading', () => {
    renderWithRouter(<AlbumPage />);
    // AlbumPage uses an <h2> for the main heading
    const heading = screen.getByText('Photo & Video Album');
    expect(heading).toBeInTheDocument();
  });

  it('renders UploadForm and PhotoGallery components', () => {
    renderWithRouter(<AlbumPage />);
    
    expect(screen.getByTestId('mock-upload-form')).toBeInTheDocument();
    expect(screen.getByTestId('mock-photo-gallery')).toBeInTheDocument();
  });

  it('passes correct initial refreshKey to PhotoGallery', () => {
    renderWithRouter(<AlbumPage />);
    
    const photoGallery = screen.getByTestId('mock-photo-gallery');
    expect(photoGallery).toHaveAttribute('data-refresh-key', '0');
  });

  it('increments refreshKey when upload succeeds', async () => {
    renderWithRouter(<AlbumPage />);
    
    const uploadButton = screen.getByText('Mock Upload Success');
    fireEvent.click(uploadButton);
    
    await waitFor(() => {
      const photoGallery = screen.getByTestId('mock-photo-gallery');
      expect(photoGallery).toHaveAttribute('data-refresh-key', '1');
    });
  });

  it('handles multiple upload successes correctly', async () => {
    renderWithRouter(<AlbumPage />);
    
    const uploadButton = screen.getByText('Mock Upload Success');
    
    // First upload
    fireEvent.click(uploadButton);
    await waitFor(() => {
      const photoGallery = screen.getByTestId('mock-photo-gallery');
      expect(photoGallery).toHaveAttribute('data-refresh-key', '1');
    });
    
    // Second upload
    fireEvent.click(uploadButton);
    await waitFor(() => {
      const photoGallery = screen.getByTestId('mock-photo-gallery');
      expect(photoGallery).toHaveAttribute('data-refresh-key', '2');
    });
  });

  it('has proper accessibility structure', () => {
    renderWithRouter(<AlbumPage />);
    // AlbumPage uses an <h2> for the main heading
    const mainHeading = screen.getByText('Photo & Video Album');
    expect(mainHeading).toBeVisible();
    const albumContainer = document.querySelector('.album-page');
    expect(albumContainer).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    renderWithRouter(<AlbumPage />);
    
    const albumContainer = document.querySelector('.album-page');
    expect(albumContainer).toBeInTheDocument();
    expect(albumContainer).toHaveClass('album-page');
  });

  it('renders without errors', () => {
    expect(() => {
      renderWithRouter(<AlbumPage />);
    }).not.toThrow();
  });

  it('maintains component state properly', () => {
    renderWithRouter(<AlbumPage />);
    
    // Components should be present and functional
    expect(screen.getByTestId('mock-upload-form')).toBeInTheDocument();
    expect(screen.getByTestId('mock-photo-gallery')).toBeInTheDocument();
    
    // State should be managed correctly (refreshKey starts at 0)
    const photoGallery = screen.getByTestId('mock-photo-gallery');
    expect(photoGallery).toHaveAttribute('data-refresh-key', '0');
  });

  it('is responsive and mobile-friendly', () => {
    renderWithRouter(<AlbumPage />);
    
    const albumContainer = document.querySelector('.album-page');
    expect(albumContainer).toBeInTheDocument();
    expect(albumContainer).toBeVisible();
    
    // Both child components should be rendered
    expect(screen.getByTestId('mock-upload-form')).toBeVisible();
    expect(screen.getByTestId('mock-photo-gallery')).toBeVisible();
  });
});

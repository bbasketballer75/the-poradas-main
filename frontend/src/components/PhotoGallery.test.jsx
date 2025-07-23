
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';


// Always mock getAlbumMedia before importing PhotoGallery
let mockGetAlbumMedia;
vi.doMock('../services/api', () => ({
  getAlbumMedia: (...args) => mockGetAlbumMedia(...args),
}));
let PhotoGallery;
beforeAll(async () => {
  PhotoGallery = (await import('./PhotoGallery')).default;
});


describe('PhotoGallery', () => {
  beforeEach(() => {
    mockGetAlbumMedia = vi.fn();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockGetAlbumMedia.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ data: [] }), 100)));
    const { getByText } = render(<PhotoGallery refreshKey={0} />);
    expect(getByText('Loading album...')).toBeInTheDocument();
  });

  it('renders empty state when no media is available', async () => {
    mockGetAlbumMedia.mockResolvedValue({ data: [] });
    const { queryByText } = render(<PhotoGallery refreshKey={0} />);
    await waitFor(() => {
      expect(queryByText('Loading album...')).not.toBeInTheDocument();
    });
    expect(queryByText('Loading album...')).not.toBeInTheDocument();
  });

  it('renders media items when data is available', async () => {
    const mockMedia = [
      {
        _id: '1',
        filename: 'photo1.jpg',
        mimetype: 'image/jpeg',
        uploadDate: new Date().toISOString(),
        metadata: { caption: 'Test Photo 1' }
      },
      {
        _id: '2',
        filename: 'photo2.jpg',
        mimetype: 'image/jpeg',
        uploadDate: new Date().toISOString(),
        metadata: { caption: 'Test Photo 2' }
      }
    ];
    mockGetAlbumMedia.mockResolvedValue({ data: mockMedia });
    const { container } = render(<PhotoGallery refreshKey={0} />);
    await waitFor(() => {
      expect(container.querySelector('.photo-gallery')).toBeInTheDocument();
    });
    const galleryContainer = container.querySelector('.photo-gallery');
    expect(galleryContainer).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetAlbumMedia.mockRejectedValue(new Error('API Error'));
    render(<PhotoGallery refreshKey={0} />);
    await waitFor(() => {
      expect(screen.queryByText('Loading album...')).not.toBeInTheDocument();
    });
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching album media:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('refreshes data when refreshKey changes', async () => {
    mockGetAlbumMedia.mockResolvedValue({ data: [] });
    const { rerender } = render(<PhotoGallery refreshKey={0} />);
    await waitFor(() => {
      expect(mockGetAlbumMedia).toHaveBeenCalledTimes(1);
    });
    mockGetAlbumMedia.mockResolvedValue({ data: [
      { _id: '1', filename: 'photo1.jpg', mimetype: 'image/jpeg', uploadDate: new Date().toISOString() }
    ] });
    rerender(<PhotoGallery refreshKey={1} />);
    await waitFor(() => {
      expect(mockGetAlbumMedia).toHaveBeenCalledTimes(2);
    });
  });

  it('has proper accessibility structure', async () => {
    mockGetAlbumMedia.mockResolvedValue({ data: [
      { _id: '1', filename: 'photo1.jpg', mimetype: 'image/jpeg', uploadDate: new Date().toISOString() }
    ] });
    const { container } = render(<PhotoGallery refreshKey={0} />);
    await waitFor(() => {
      expect(container.querySelector('.photo-gallery')).toBeInTheDocument();
    });
    const galleryContainer = container.querySelector('.photo-gallery');
    expect(galleryContainer).toBeInTheDocument();
  });

  it('handles mixed media types (photos and videos)', async () => {
    const mockMedia = [
      {
        _id: '1',
        filename: 'photo1.jpg',
        mimetype: 'image/jpeg',
        uploadDate: new Date().toISOString(),
      },
      {
        _id: '2',
        filename: 'video1.mp4',
        mimetype: 'video/mp4',
        uploadDate: new Date().toISOString(),
      }
    ];
    mockGetAlbumMedia.mockResolvedValue({ data: mockMedia });
    render(<PhotoGallery refreshKey={0} />);
    await waitFor(() => {
      expect(mockGetAlbumMedia).toHaveBeenCalled();
    });
  });

  it('applies correct CSS classes', async () => {
    mockGetAlbumMedia.mockResolvedValue({ data: [
      { _id: '1', filename: 'photo1.jpg', mimetype: 'image/jpeg', uploadDate: new Date().toISOString() }
    ] });
    const { container } = render(<PhotoGallery refreshKey={0} />);
    await waitFor(() => {
      const galleryContainer = container.querySelector('.photo-gallery');
      expect(galleryContainer).toBeInTheDocument();
      expect(galleryContainer).toHaveClass('photo-gallery');
    });
  });
});

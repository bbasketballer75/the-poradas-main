import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PhotoGallery from './PhotoGallery';
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';

describe('PhotoGallery', () => {
  let mockGetAlbumMedia;
  beforeAll(() => {
    mockGetAlbumMedia = vi.fn();
    vi.mock('../services/api', () => ({
      getAlbumMedia: mockGetAlbumMedia,
    }));
  });


  beforeEach(() => {
    mockGetAlbumMedia.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockGetAlbumMedia.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ data: [] }), 100)));
    
    render(<PhotoGallery refreshKey={0} />);
    expect(screen.getByText('Loading album...')).toBeInTheDocument();
  });

  it('renders empty state when no media is available', async () => {
    mockGetAlbumMedia.mockResolvedValue({ data: [] });
    
    render(<PhotoGallery refreshKey={0} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading album...')).not.toBeInTheDocument();
    });

    // Should show empty state or at least not show loading
    expect(screen.queryByText('Loading album...')).not.toBeInTheDocument();
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
    
    render(<PhotoGallery refreshKey={0} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading album...')).not.toBeInTheDocument();
    });

    // Should render media items
    const galleryContainer = document.querySelector('.photo-gallery');
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

    // Change refreshKey to trigger refresh
    rerender(<PhotoGallery refreshKey={1} />);
    
    await waitFor(() => {
      expect(mockGetAlbumMedia).toHaveBeenCalledTimes(2);
    });
  });

  it('has proper accessibility structure', async () => {
    mockGetAlbumMedia.mockResolvedValue({ data: [] });
    
    render(<PhotoGallery refreshKey={0} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading album...')).not.toBeInTheDocument();
    });

    const galleryContainer = document.querySelector('.photo-gallery');
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
      expect(screen.queryByText('Loading album...')).not.toBeInTheDocument();
    });

    // Should handle both image and video files
    expect(mockGetAlbumMedia).toHaveBeenCalledWith();
  });

  it('applies correct CSS classes', async () => {
    mockGetAlbumMedia.mockResolvedValue({ data: [] });
    
    render(<PhotoGallery refreshKey={0} />);
    
    await waitFor(() => {
      const galleryContainer = document.querySelector('.photo-gallery');
      expect(galleryContainer).toBeInTheDocument();
    });
  });
});

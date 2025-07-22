
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VideoPlayer from './VideoPlayer';
import { describe, it, expect, afterEach, vi } from 'vitest';

// Mock for HTMLMediaElement methods
Object.defineProperty(window.HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: vi.fn(() => Promise.resolve()),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: vi.fn(),
});

describe('VideoPlayer', () => {
  const defaultProps = {
    src: '/videos/test-video.mp4',
    title: 'Test Wedding Video'
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with loading state initially', () => {
    render(<VideoPlayer {...defaultProps} />);
    
    expect(screen.getByText('Loading video...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading video')).toBeInTheDocument();
  });

  it('renders video player when video loads successfully', async () => {
    render(<VideoPlayer {...defaultProps} />);
    
    const video = screen.getByRole('application');
    
    // Simulate video loaded
    fireEvent.loadedData(video);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading video...')).not.toBeInTheDocument();
      expect(video).toHaveAttribute('src', '/videos/test-video.mp4');
      expect(video).toHaveAttribute('aria-label', 'Test Wedding Video');
    });
    
    expect(screen.getByText('Test Wedding Video')).toBeInTheDocument();
    expect(screen.getByText(/Use the video controls to play, pause, and adjust the volume/)).toBeInTheDocument();
  });

  it('displays error state when video fails to load', async () => {
    render(<VideoPlayer {...defaultProps} />);
    
    const video = screen.getByRole('application');
    
    // Simulate video error
    fireEvent.error(video);
    
    await waitFor(() => {
      expect(screen.getByText('Unable to load video')).toBeInTheDocument();
      expect(screen.getByText(/Sorry, there was a problem loading the video/)).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  it('allows retry after error', async () => {
    render(<VideoPlayer {...defaultProps} />);
    
    const video = screen.getByRole('application');
    
    // Simulate video error
    fireEvent.error(video);
    
    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
    
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);
    
    // Should return to loading state
    expect(screen.getByText('Loading video...')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', async () => {
    render(<VideoPlayer {...defaultProps} />);
    
    const video = screen.getByRole('application');
    
    expect(video).toHaveAttribute('aria-label', 'Test Wedding Video');
    expect(video).toHaveAttribute('controls');
    
    // Simulate video loaded
    fireEvent.loadedData(video);
    
    await waitFor(() => {
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveTextContent('Test Wedding Video');
    });
  });

  it('handles missing src gracefully', () => {
    render(<VideoPlayer title="Test Video" />);
    
    expect(screen.getByText('Loading video...')).toBeInTheDocument();
  });

  it('handles missing title gracefully', async () => {
    render(<VideoPlayer src="/videos/test-video.mp4" />);
    
    const video = screen.getByRole('application');
    
    // Simulate video loaded
    fireEvent.loadedData(video);
    
    await waitFor(() => {
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });
  });

  it('updates loading state properly during transitions', async () => {
    render(<VideoPlayer {...defaultProps} />);
    
    // Should start in loading state
    expect(screen.getByText('Loading video...')).toBeInTheDocument();
    
    const video = screen.getByRole('application');
    
    // Simulate loadstart event
    fireEvent.loadStart(video);
    expect(screen.getByText('Loading video...')).toBeInTheDocument();
    
    // Simulate video loaded
    fireEvent.loadedData(video);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading video...')).not.toBeInTheDocument();
    });
  });

  it('applies correct CSS classes for different states', async () => {
    render(<VideoPlayer {...defaultProps} />);
    
    // Loading state
    expect(document.querySelector('.video-loading')).toBeInTheDocument();
    
    const video = screen.getByRole('application');
    
    // Error state
    fireEvent.error(video);
    
    await waitFor(() => {
      expect(document.querySelector('.video-error')).toBeInTheDocument();
    });
    
    // Retry and load successfully
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);
    fireEvent.loadedData(video);
    
    await waitFor(() => {
      expect(document.querySelector('.video-container')).toBeInTheDocument();
      expect(document.querySelector('.video-loading')).not.toBeInTheDocument();
      expect(document.querySelector('.video-error')).not.toBeInTheDocument();
    });
  });
});

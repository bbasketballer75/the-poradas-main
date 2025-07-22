
import { render, screen } from '@testing-library/react';
import PhotoGallery from './PhotoGallery';
import { describe, it, expect, vi } from 'vitest';

// Mock the api service
vi.mock('../services/api', () => ({
  getAlbumMedia: vi.fn(() => new Promise(resolve => setTimeout(() => resolve({ data: [] }), 100))),
}));

describe('PhotoGallery', () => {
  it('renders loading state initially', () => {
    render(<PhotoGallery refreshKey={0} />);
    expect(screen.getByText('Loading album...')).toBeInTheDocument();
  });
});

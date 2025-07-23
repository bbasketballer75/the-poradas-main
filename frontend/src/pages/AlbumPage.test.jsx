import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import AlbumPage from './AlbumPage';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as api from '../services/api';

vi.mock('../services/api', () => {
  return {
    getAlbumMedia: vi.fn(() => new Promise(resolve => setTimeout(() => resolve({ data: [
      { _id: '1', filename: '1.jpg' },
      { _id: '2', filename: '2.jpg' },
    ] }), 50))),
    uploadMedia: vi.fn(() => Promise.resolve({})),
  };
});


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

  it('shows loading screen and then renders album content', async () => {
    await act(async () => {
      renderWithRouter(<AlbumPage />);
    });
    expect(screen.getByText(/Loading album/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/Loading album/i)).not.toBeInTheDocument());
    expect(screen.getByRole('heading', { name: 'Photo & Video Album' })).toBeInTheDocument();
    expect(document.querySelector('.photo-grid')).toBeInTheDocument();
    expect(document.querySelectorAll('.photo-card').length).toBeGreaterThan(0);
  });

  it('renders upload input and button', async () => {
    await act(async () => {
      renderWithRouter(<AlbumPage />);
    });
    await waitFor(() => expect(screen.queryByText(/Loading album/i)).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: /Upload Photo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload Photo/i })).toBeInTheDocument();
    // The input is type="file" with no label, so use querySelector
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
  });

  it('calls uploadMedia when upload button is clicked', async () => {
    await act(async () => {
      renderWithRouter(<AlbumPage />);
    });
    await waitFor(() => expect(screen.queryByText(/Loading album/i)).not.toBeInTheDocument());
    // The input is type="file" with no label, so use querySelector
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });
    const uploadButton = screen.getByRole('button', { name: /Upload Photo/i });
    await act(async () => {
      fireEvent.click(uploadButton);
    });
    await waitFor(() => expect(api.uploadMedia).toHaveBeenCalled());
  });

  it('applies correct CSS classes and structure', async () => {
    await act(async () => {
      renderWithRouter(<AlbumPage />);
    });
    await waitFor(() => expect(screen.queryByText(/Loading album/i)).not.toBeInTheDocument());
    const albumContainer = document.querySelector('.album-page');
    expect(albumContainer).toBeInTheDocument();
    expect(albumContainer).toHaveClass('album-page');
    expect(document.querySelector('.photo-grid')).toBeInTheDocument();
  });

  it('renders without errors', () => {
    expect(() => {
      act(() => {
        renderWithRouter(<AlbumPage />);
      });
    }).not.toThrow();
  });
});

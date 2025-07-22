
import { render, screen } from '@testing-library/react';
import UploadForm from './UploadForm';
import { describe, it, expect, vi } from 'vitest';

// Mock the api service
vi.mock('../services/api', () => ({
  uploadMedia: vi.fn(() => Promise.resolve()),
}));

describe('UploadForm', () => {
  it('renders the upload form', () => {
    render(<UploadForm />);
    expect(screen.getByText('Contribute to Our Album')).toBeInTheDocument();
    expect(screen.getByText('Share your favorite moments from our special day!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload file/i })).toBeInTheDocument();
  });
});

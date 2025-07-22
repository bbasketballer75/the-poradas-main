
import { render, screen } from '@testing-library/react';
import AdminDashboard from './AdminDashboard';
import { describe, it, expect, vi } from 'vitest';

// Mock the api service
vi.mock('../services/api', () => ({
  getAllAlbumMedia: vi.fn(() => new Promise(resolve => setTimeout(() => resolve({ data: [] }), 100))),
  moderateMedia: vi.fn(),
}));

describe('AdminDashboard', () => {
  it('renders loading state initially', () => {
    render(<AdminDashboard adminKey="test-key" />);
    expect(screen.getByText('Loading submissions...')).toBeInTheDocument();
  });
});

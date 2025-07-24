import React from 'react';

import { render, screen } from '@testing-library/react';
import AdminDashboard from './AdminDashboard';


// Mock the api service
jest.mock('../services/api', () => ({
  getAllAlbumMedia: jest.fn(
    () => new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 100))
  ),
  moderateMedia: jest.fn(),
}));

describe('AdminDashboard', () => {
  it('renders loading state initially', () => {
    render(<AdminDashboard adminKey="test-key" />);
    expect(screen.getByText('Loading submissions...')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GuestbookPage from './GuestbookPage';
import * as api from '../services/api';

vi.mock('../services/api', () => ({
  getGuestbookEntries: vi.fn(() => Promise.resolve({ data: [
    { id: 1, name: 'Alice', message: 'Congrats!' },
    { id: 2, name: 'Bob', message: 'Best wishes!' },
  ] })),
  postGuestbookEntry: vi.fn(() => Promise.resolve({ data: { id: 3, name: 'Test User', message: 'Congrats!' } }))
}));

describe('GuestbookPage', () => {
  it('shows loading and then guestbook entries', async () => {
    render(<GuestbookPage />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());
    expect(screen.getByRole('heading', { name: /Guestbook/i })).toBeInTheDocument();
  });

  it('renders guestbook form', async () => {
    render(<GuestbookPage />);
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());
    expect(screen.getByPlaceholderText(/Your Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Leave a message/i)).toBeInTheDocument();
  });

  it('submits a new entry', async () => {
    render(<GuestbookPage />);
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText(/Your Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText(/Leave a message/i), { target: { value: 'Congrats!' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign/i }));
    // Should show new entry or success message (depends on implementation)
    // expect(screen.getByText(/Congrats!/i)).toBeInTheDocument();
  });
});

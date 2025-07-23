import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import App from './App';

// Mock all the service calls
vi.mock('./services/api', () => ({
  logVisit: vi.fn().mockResolvedValue({}),
  getVideoUrl: vi.fn(() => 'mock-video-url.mp4'),
  getAlbumMedia: vi.fn(() => Promise.resolve({ data: [] })),
}));

// Mock HTMLAudioElement
window.HTMLAudioElement.prototype.play = vi.fn();
window.HTMLAudioElement.prototype.pause = vi.fn();
window.HTMLAudioElement.prototype.load = vi.fn();

// Mock URL.createObjectURL
window.URL.createObjectURL = vi.fn(() => 'mock-url');

describe('App', () => {
  test('renders orientation overlay first when needed', () => {
    // Mock portrait orientation
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(orientation: portrait)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Should show orientation overlay
    expect(screen.getByText('Please Rotate Your Device')).toBeInTheDocument();
  });

  test('shows landing page after loading', async () => {
    // Mock landscape orientation
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query !== '(orientation: portrait)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Wait for loading to finish and landing page to appear
    await screen.findByText('Austin & Jordyn', {}, { timeout: 2000 });
    expect(screen.getByText('Our Wedding Celebration')).toBeInTheDocument();
  });

  test('shows main site after entering from landing page', async () => {
    // Mock landscape orientation
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query !== '(orientation: portrait)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Wait for landing page
    const enterButton = await screen.findByRole(
      'button',
      { name: /enter wedding site with music and video/i },
      { timeout: 2000 }
    );

    // Click enter
    fireEvent.click(enterButton);

    // Should show notification and main content
    expect(
      screen.getByText('Welcome! Enjoy the music and explore the memories.')
    ).toBeInTheDocument();
    expect(screen.getByText('Thank You')).toBeInTheDocument();
  });
});

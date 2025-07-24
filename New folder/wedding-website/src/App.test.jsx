import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import App from './App';

// Mock all the service calls
jest.mock('./services/api', () => ({
  logVisit: jest.fn().mockResolvedValue({}),
  getVideoUrl: jest.fn(() => 'mock-video-url.mp4'),
  getAlbumMedia: jest.fn(() => Promise.resolve({ data: [] })),
}));

// Mock HTMLAudioElement
window.HTMLAudioElement.prototype.play = jest.fn();
window.HTMLAudioElement.prototype.pause = jest.fn();
window.HTMLAudioElement.prototype.load = jest.fn();

// Mock URL.createObjectURL
window.URL.createObjectURL = jest.fn(() => 'mock-url');

describe('App', () => {
  test('renders orientation overlay first when needed', () => {
    // Mock portrait orientation
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === '(orientation: portrait)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
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
      value: jest.fn().mockImplementation((query) => ({
        matches: query !== '(orientation: portrait)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
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
      value: jest.fn().mockImplementation((query) => ({
        matches: query !== '(orientation: portrait)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
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
      await screen.findByText('Welcome! Enjoy the music and explore the memories.', {}, { timeout: 2000 })
    ).toBeInTheDocument();
    expect(await screen.findByText('Thank You', {}, { timeout: 2000 })).toBeInTheDocument();
  });
});

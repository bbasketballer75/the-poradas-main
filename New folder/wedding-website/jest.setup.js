// Polyfill import.meta.env for Jest (Vite-specific)
if (typeof globalThis.import === 'undefined') {
  globalThis.import = {};
}
if (typeof globalThis.import.meta === 'undefined') {
  globalThis.import.meta = { env: { VITE_API_BASE_URL: 'http://localhost:3000/api' } };
}
// Polyfill for Node.js globals required by some dependencies
try {
  const { TextEncoder, TextDecoder } = require('util');
  if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder;
  }
  if (typeof global.TextDecoder === 'undefined') {
    global.TextDecoder = TextDecoder;
  }
} catch (e) {
  // If running in a browser-like environment, do nothing
}

// Mock fetch for tests
global.fetch = jest.fn();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock URL.createObjectURL
window.URL.createObjectURL = jest.fn(() => 'mock-url');

// Mock HTMLAudioElement
global.HTMLAudioElement = jest.fn().mockImplementation(() => ({
  play: jest.fn(),
  pause: jest.fn(),
  load: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock HTMLMediaElement prototype methods
Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: jest.fn(() => Promise.resolve()),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(window.HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: jest.fn(),
});

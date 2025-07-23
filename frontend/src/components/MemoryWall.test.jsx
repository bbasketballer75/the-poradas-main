import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import MemoryWall from './MemoryWall';

// Mock URL.createObjectURL
window.URL.createObjectURL = vi.fn(() => 'mock-url');

describe('MemoryWall', () => {
  test('renders memory wall with initial memories', () => {
    render(<MemoryWall />);

    expect(screen.getByText('Memory Wall & Photo Booth')).toBeInTheDocument();
    expect(screen.getByText('Such a beautiful day! Congrats!')).toBeInTheDocument();
    expect(screen.getByText('Wishing you a lifetime of happiness!')).toBeInTheDocument();
    expect(screen.getByText('Emily')).toBeInTheDocument();
    expect(screen.getByText('Michael')).toBeInTheDocument();
  });

  test('renders memory form with required fields', () => {
    render(<MemoryWall />);

    expect(screen.getByPlaceholderText('Your Name (optional)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Share a memory or message...')).toBeInTheDocument();
    expect(screen.getByText('Post Memory')).toBeInTheDocument();
  });

  test('submit button is disabled when message is empty', () => {
    render(<MemoryWall />);

    const submitBtn = screen.getByRole('button', { name: /post memory/i });
    expect(submitBtn).toBeDisabled();
  });

  test('submit button is enabled when message is filled', () => {
    render(<MemoryWall />);

    const messageInput = screen.getByPlaceholderText('Share a memory or message...');
    fireEvent.change(messageInput, { target: { value: 'Test message' } });

    const submitBtn = screen.getByRole('button', { name: /post memory/i });
    expect(submitBtn).not.toBeDisabled();
  });

  test('can add a new memory', async () => {
    render(<MemoryWall />);

    const nameInput = screen.getByPlaceholderText('Your Name (optional)');
    const messageInput = screen.getByPlaceholderText('Share a memory or message...');
    const submitBtn = screen.getByRole('button', { name: /post memory/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(messageInput, { target: { value: 'Test memory message' } });
    fireEvent.click(submitBtn);

    // Should show "Posting..." during submission
    expect(screen.getByText('Posting...')).toBeInTheDocument();

    // Wait for the new memory to appear
    await waitFor(
      () => {
        expect(screen.getByText('Test memory message')).toBeInTheDocument();
        expect(screen.getByText('Test User')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  test('displays emoji reaction buttons', () => {
    render(<MemoryWall />);

    // Check for emoji buttons
    expect(screen.getAllByText('❤️').length).toBeGreaterThan(0);
    expect(screen.getAllByText('😂').length).toBeGreaterThan(0);
    expect(screen.getAllByText('🥰').length).toBeGreaterThan(0);
    expect(screen.getAllByText('🎉').length).toBeGreaterThan(0);
  });

  test('can react with emojis', () => {
    render(<MemoryWall />);

    // Find the first heart emoji button and click it
    const heartButtons = screen.getAllByRole('button', { name: /react with ❤️/i });
    fireEvent.click(heartButtons[0]);

    // The reaction count should increase (Emily's memory should go from 2 to 3)
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('handles file upload for image preview', () => {
    const { container } = render(<MemoryWall />);
    // Select the file input directly from the rendered container
    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    // Should show preview image
    expect(screen.getByAltText('Preview')).toBeInTheDocument();
  });
});

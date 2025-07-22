
import { render, screen } from '@testing-library/react';
import VideoPlayer from './VideoPlayer';
import { describe, it, expect } from 'vitest';

describe('VideoPlayer', () => {
  it('renders the video player with the correct source', () => {
    const videoSrc = 'test.mp4';
    render(<VideoPlayer src={videoSrc} />);
    const videoElement = screen.getByTestId('video-player');
    expect(videoElement).toBeInTheDocument();
    expect(videoElement.querySelector('source')).toHaveAttribute('src', videoSrc);
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import WeddingPartyPage from './WeddingPartyPage';

describe('WeddingPartyPage', () => {
  it('renders wedding party heading', () => {
    render(<WeddingPartyPage />);
    expect(screen.getByRole('heading', { name: /Wedding Party/i })).toBeInTheDocument();
  });
});

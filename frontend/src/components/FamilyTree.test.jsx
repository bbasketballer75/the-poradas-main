
import { render, screen } from '@testing-library/react';
import FamilyTree from './FamilyTree';
import { describe, it, expect } from 'vitest';

describe('FamilyTree', () => {
  it('renders the family tree with the main elders', () => {
    render(<FamilyTree />);
    expect(screen.getByText('The Porada & Smith Elders')).toBeInTheDocument();
    expect(screen.getByText('Grandparents')).toBeInTheDocument();
  });
});

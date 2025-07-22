
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordPrompt from './PasswordPrompt';
import { describe, it, expect, vi } from 'vitest';

describe('PasswordPrompt', () => {
  it('renders the password prompt and calls onCorrectPassword on submit', async () => {
    const onCorrectPassword = vi.fn();
    render(<PasswordPrompt onCorrectPassword={onCorrectPassword} />);

    const passwordInput = screen.getByPlaceholderText('Enter admin key');
    const submitButton = screen.getByText('Unlock');

    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    await userEvent.type(passwordInput, 'test-password');
    await userEvent.click(submitButton);

    expect(onCorrectPassword).toHaveBeenCalledWith('test-password');
  });
});

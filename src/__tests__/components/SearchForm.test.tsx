import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';
import { SearchForm } from '../../components/SearchForm';

describe('SearchForm', () => {
  let mockOnSearch: ReturnType<typeof vi.fn>;
  let user: UserEvent;

  beforeEach(() => {
    mockOnSearch = vi.fn();
    user = userEvent.setup();
  });

  it('should render input and button', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('should submit form with valid query', async () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'Lab');
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('Lab');
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  it('should disable button when loading', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should disable input when loading', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={true} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('should prevent submission with empty query', async () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('should call onSearch callback with trimmed query', async () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, '  Lab  ');
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('Lab');
  });

  it('should show "Searching..." text when loading', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={true} />);

    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('should submit on Enter key press', async () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Lab{Enter}');

    expect(mockOnSearch).toHaveBeenCalledWith('Lab');
  });

  it('should have proper aria-label on input', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByLabelText('Search course tree');
    expect(input).toBeInTheDocument();
  });
});


import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { searchCourseTree } from '../services/api';
import { CourseItem } from '../types/course';

// Mock the API service
vi.mock('../services/api');

describe('App Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render search form on initial load', () => {
    render(<App />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByText('Course Tree Search')).toBeInTheDocument();
  });

  it('should display results after successful search', async () => {
    const user = userEvent.setup();
    const mockItems: CourseItem[] = [
      { id: 1, name: 'Lab Experiment 1', parent_id: 0 },
      { id: 2, name: 'Surface Chemistry', parent_id: 1 }
    ];

    vi.mocked(searchCourseTree).mockResolvedValueOnce(mockItems);

    render(<App />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'Lab');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Lab Experiment 1')).toBeInTheDocument();
    });

    expect(screen.getByText('- Surface Chemistry')).toBeInTheDocument();
  });

  it('should display error message on API error', async () => {
    const user = userEvent.setup();
    // The API service wraps errors with "Network error: " prefix
    const errorMessage = 'Network error: Failed to fetch. Please try again.';

    vi.mocked(searchCourseTree).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    render(<App />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'error');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should disable form during loading', async () => {
    const user = userEvent.setup();
    const mockItems: CourseItem[] = [
      { id: 1, name: 'Test', parent_id: 0 }
    ];

    // Create a promise that we can control
    let resolvePromise: (value: CourseItem[]) => void;
    const controlledPromise = new Promise<CourseItem[]>((resolve) => {
      resolvePromise = resolve;
    });

    vi.mocked(searchCourseTree).mockReturnValueOnce(controlledPromise);

    render(<App />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'Test');
    await user.click(button);

    // Check loading state
    expect(button).toBeDisabled();
    expect(input).toBeDisabled();
    expect(screen.getByText('Searching...')).toBeInTheDocument();

    // Resolve the promise
    resolvePromise!(mockItems);

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it('should show appropriate message for empty results', async () => {
    const user = userEvent.setup();

    vi.mocked(searchCourseTree).mockResolvedValueOnce([]);

    render(<App />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    await user.type(input, 'lab');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('No results found for your search.')).toBeInTheDocument();
      expect(screen.queryByText('Network error')).not.toBeInTheDocument();
    });
  });

  it('should clear previous results on new search', async () => {
    const user = userEvent.setup();
    const firstResults: CourseItem[] = [
      { id: 1, name: 'First Result', parent_id: 0 }
    ];
    const secondResults: CourseItem[] = [
      { id: 2, name: 'Second Result', parent_id: 0 }
    ];

    vi.mocked(searchCourseTree)
      .mockResolvedValueOnce(firstResults)
      .mockResolvedValueOnce(secondResults);

    render(<App />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    // First search
    await user.clear(input);
    await user.type(input, 'First');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('First Result')).toBeInTheDocument();
    });

    // Second search
    await user.clear(input);
    await user.type(input, 'Second');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Second Result')).toBeInTheDocument();
      expect(screen.queryByText('First Result')).not.toBeInTheDocument();
    });
  });

  it('should handle rapid successive searches', async () => {
    const user = userEvent.setup();
    const results: CourseItem[] = [
      { id: 1, name: 'Result', parent_id: 0 }
    ];

    vi.mocked(searchCourseTree).mockResolvedValue(results);

    render(<App />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    // Rapid clicks
    await user.type(input, 'Test');
    await user.click(button);
    await user.click(button);
    await user.click(button);

    await waitFor(() => {
      expect(searchCourseTree).toHaveBeenCalledTimes(3);
    });
  });
});


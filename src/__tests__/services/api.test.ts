import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchCourseTree } from '../../services/api';
import { CourseItem } from '../../types/course';

// Mock global fetch
global.fetch = vi.fn();

describe('searchCourseTree', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return empty array for empty query', async () => {
    const result = await searchCourseTree('');
    expect(result).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should return empty array for whitespace-only query', async () => {
    const result = await searchCourseTree('   ');
    expect(result).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should successfully fetch and return course items', async () => {
    const mockItems: CourseItem[] = [
      { id: 1, name: 'Lab Experiment 1', parent_id: 0 },
      { id: 2, name: 'Surface Chemistry', parent_id: 1 }
    ];

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockItems
    });

    const result = await searchCourseTree('Lab');

    expect(fetch).toHaveBeenCalledWith(
      'https://coursetreesearch-service-sandbox.dev.tophat.com/?query=Lab'
    );
    expect(result).toEqual(mockItems);
  });

  it('should handle empty array response', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    const result = await searchCourseTree('error');

    expect(result).toEqual([]);
  });

  it('should encode query parameters correctly', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    await searchCourseTree('Lab Experiment');

    expect(fetch).toHaveBeenCalledWith(
      'https://coursetreesearch-service-sandbox.dev.tophat.com/?query=Lab%20Experiment'
    );
  });

  it('should handle special characters in query', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    await searchCourseTree('Lab & Test');

    expect(fetch).toHaveBeenCalledWith(
      'https://coursetreesearch-service-sandbox.dev.tophat.com/?query=Lab%20%26%20Test'
    );
  });

  it('should trim query before making request', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    await searchCourseTree('  Lab  ');

    expect(fetch).toHaveBeenCalledWith(
      'https://coursetreesearch-service-sandbox.dev.tophat.com/?query=Lab'
    );
  });

  it('should throw error on network failure', async () => {
    const networkError = new Error('Network request failed');
    (fetch as any).mockRejectedValueOnce(networkError);

    await expect(searchCourseTree('Lab')).rejects.toThrow(
      'Network error: Network request failed. Please try again.'
    );
  });

  it('should throw error on HTTP 404 status', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    await expect(searchCourseTree('Lab')).rejects.toThrow(
      'Network error: API request failed with status 404. Please try again.'
    );
  });

  it('should throw error on HTTP 500 status', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    await expect(searchCourseTree('Lab')).rejects.toThrow(
      'Network error: API request failed with status 500. Please try again.'
    );
  });

  it('should handle non-array response (object)', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Error' })
    });

    const result = await searchCourseTree('Lab');

    expect(result).toEqual([]);
  });

  it('should handle non-array response (null)', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => null
    });

    const result = await searchCourseTree('Lab');

    expect(result).toEqual([]);
  });

  it('should handle response wrapped in items property', async () => {
    const mockItems: CourseItem[] = [
      { id: 1, name: 'Test', parent_id: 0 }
    ];

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: mockItems })
    });

    const result = await searchCourseTree('Test');

    // Currently returns empty array for non-array responses
    // This test documents current behavior
    expect(result).toEqual([]);
  });

  it('should throw generic error for unexpected error types', async () => {
    (fetch as any).mockRejectedValueOnce('String error');

    await expect(searchCourseTree('Lab')).rejects.toThrow(
      'An unexpected error occurred. Please try again.'
    );
  });
});


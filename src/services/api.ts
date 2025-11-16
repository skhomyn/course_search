import { CourseItem } from '../types/course';

const API_BASE_URL = 'https://coursetreesearch-service-sandbox.dev.tophat.com';

export interface ApiError {
  message: string;
}

/**
 * Searches the course tree API for items matching the query.
 * 
 * @param query - The search term
 * @returns Promise resolving to an array of course items
 * @throws Error if the API call fails
 */
export async function searchCourseTree(query: string): Promise<CourseItem[]> {
  if (!query.trim()) {
    return [];
  }

  const url = `${API_BASE_URL}/?query=${encodeURIComponent(query.trim())}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    
    // Handle case where API returns empty result (e.g. for "error" keyword)
    if (!Array.isArray(data)) {
      return [];
    }
    
    // TODO: Add runtime validation for production (e.g. type guard or Zod schema) 
    // to ensure data matches CourseItem[] structure. Using 'as' assertion bypasses
    // TypeScript's type checking and doesn't validate at runtime.
    return data as CourseItem[];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Network error: ${error.message}. Please try again.`);
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
}


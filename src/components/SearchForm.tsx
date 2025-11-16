import { useState, FormEvent } from 'react';
import '../styles/SearchForm.css';

interface SearchFormProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

/**
 * Renders a search form for filtering course items in the tree view.
 * 
 * Provides a text input and submit button for user search queries. Handles
 * form validation (prevents empty/whitespace-only queries), loading states,
 * and accessibility features. Trims whitespace from queries before submission.
 * 
 * @param onSearch - Callback function called with the trimmed search query when form is submitted
 * @param isLoading - Boolean indicating if a search operation is in progress
 * @returns JSX element containing the search form with input field and submit button
 */
export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const trimmedQuery = query.trim();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (trimmedQuery && !isLoading) {
      onSearch(trimmedQuery);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search term (e.g. 'Lab')"
          className="search-input"
          disabled={isLoading}
          aria-label="Search course tree"
        />
        <button
          type="submit"
          className="search-button"
          disabled={isLoading || !trimmedQuery}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
}


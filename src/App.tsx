import { useState } from 'react';
import { SearchForm } from './components/SearchForm';
import { CourseTree } from './components/CourseTree';
import { ErrorMessage } from './components/ErrorMessage';
import { searchCourseTree } from './services/api';
import { CourseItem } from './types/course';
import './styles/App.css';

/**
 * Main application component for the Course Tree Search application.
 * 
 * Orchestrates the search functionality by managing application state and coordinating
 * between the search form, results display, and error handling components.
 * Handles API calls to search for course items and displays them in a hierarchical 
 * tree structure.
 *
 * @returns JSX element containing the complete application layout with header,
 *          search form, error messages, and course tree results
 */
function App() {
  const [items, setItems] = useState<CourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setItems([]);
    setHasSearched(true);

    try {
      const results = await searchCourseTree(query);
      setItems(results);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Course Tree Search</h1>
        <p className="app-subtitle">Search for course items and view their hierarchical structure</p>
      </header>
      
      <main className="app-main">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        
        {error && <ErrorMessage message={error} />}
        
        {hasSearched && !error && <CourseTree items={items} />}
      </main>
    </div>
  );
}

export default App;


import '../styles/ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
}

/**
 * Displays an error message to the user with proper accessibility support.
 * 
 * @param message - The error message text to display to the user
 * @returns JSX element containing the styled error message
 */
export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert">
      <p className="error-text">{message}</p>
    </div>
  );
}


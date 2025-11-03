import { Link } from 'react-router-dom';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

export const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">😵</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 mb-6">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <div className="flex gap-4 justify-center">
          {resetError && (
            <button 
              onClick={resetError}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
            >
              Try Again
            </button>
          )}
          <Link 
            to="/"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};
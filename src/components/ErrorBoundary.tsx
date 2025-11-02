import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Gospel Hub Error:', error, errorInfo);
    
    // Log to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // Analytics logging would go here
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error }> = ({ error }) => {
  const { currentTheme } = useTheme();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: currentTheme.colors.background }}
    >
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">📖</div>
        <h1 className="text-2xl font-bold mb-4" style={{ color: currentTheme.colors.text }}>
          Something went wrong
        </h1>
        <p className="mb-6" style={{ color: currentTheme.colors.textSecondary }}>
          We're sorry, but Gospel Hub encountered an error. Please refresh the page to continue.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-lg font-medium"
          style={{
            backgroundColor: currentTheme.colors.primary,
            color: 'white'
          }}
        >
          Refresh Page
        </button>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm" style={{ color: currentTheme.colors.textSecondary }}>
              Error Details
            </summary>
            <pre className="mt-2 p-2 text-xs rounded border overflow-auto"
              style={{
                backgroundColor: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border,
                color: currentTheme.colors.text
              }}
            >
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export const ErrorBoundary: React.FC<Props> = (props) => (
  <ErrorBoundaryClass {...props} />
);
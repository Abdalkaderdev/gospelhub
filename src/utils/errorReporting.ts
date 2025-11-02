// Error reporting and monitoring utilities
export const errorReporter = {
  // Log errors to console in development, external service in production
  logError: (error: Error, context?: string) => {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    if (process.env.NODE_ENV === 'development') {
      console.error('Gospel Hub Error:', errorInfo);
    } else {
      // In production, send to error tracking service
      // Example: Sentry, LogRocket, etc.
      try {
        fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorInfo)
        }).catch(() => {
          // Fallback: store in localStorage for later sync
          const errors = JSON.parse(localStorage.getItem('pending-errors') || '[]');
          errors.push(errorInfo);
          localStorage.setItem('pending-errors', JSON.stringify(errors.slice(-10))); // Keep last 10
        });
      } catch (e) {
        console.error('Failed to report error:', e);
      }
    }
  },

  // Track user interactions for debugging
  trackInteraction: (action: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('User interaction:', action, data);
    }
    
    // Store interaction history for debugging
    const interactions = JSON.parse(sessionStorage.getItem('interactions') || '[]');
    interactions.push({
      action,
      data,
      timestamp: Date.now()
    });
    sessionStorage.setItem('interactions', JSON.stringify(interactions.slice(-50))); // Keep last 50
  },

  // Performance monitoring
  measurePerformance: (name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    
    if (end - start > 100) { // Log slow operations
      console.warn(`Slow operation: ${name} took ${end - start}ms`);
    }
  }
};

// Global error handlers
export const setupGlobalErrorHandling = () => {
  // Catch unhandled JavaScript errors
  window.addEventListener('error', (event) => {
    errorReporter.logError(new Error(event.message), `Global error at ${event.filename}:${event.lineno}`);
  });

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorReporter.logError(new Error(event.reason), 'Unhandled promise rejection');
  });

  // Monitor resource loading errors
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      errorReporter.logError(new Error(`Resource failed to load: ${(event.target as any)?.src || 'unknown'}`), 'Resource loading error');
    }
  }, true);
};
// Error reporting and monitoring utilities
export const errorReporter = {
  // Log errors to console in development, external service in production
  logError: (error: Error, context?: string) => {
    // Sanitize error message and context to prevent log injection
    const sanitizedMessage = error.message.replace(/[\r\n\t]/g, ' ').substring(0, 500);
    const sanitizedContext = context?.replace(/[\r\n\t]/g, ' ').substring(0, 200) || '';
    
    const errorInfo = {
      message: sanitizedMessage,
      stack: error.stack?.substring(0, 1000), // Limit stack trace length
      context: sanitizedContext,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent.substring(0, 200), // Limit user agent length
      url: window.location.href.substring(0, 200) // Limit URL length
    };

    if (process.env.NODE_ENV === 'development') {
      console.error('Gospel Hub Error:', errorInfo);
    } else {
      // In production, send to error tracking service
      // Example: Sentry, LogRocket, etc.
      try {
        fetch('/api/errors', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest' // CSRF protection
          },
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
    // Sanitize action string to prevent log injection
    const sanitizedAction = action.replace(/[\r\n\t]/g, ' ').substring(0, 100);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('User interaction:', sanitizedAction, data);
    }
    
    // Store interaction history for debugging
    const interactions = JSON.parse(sessionStorage.getItem('interactions') || '[]');
    interactions.push({
      action: sanitizedAction,
      data: typeof data === 'string' ? data.substring(0, 200) : data, // Limit string data
      timestamp: Date.now()
    });
    sessionStorage.setItem('interactions', JSON.stringify(interactions.slice(-50))); // Keep last 50
  },

  // Performance monitoring
  measurePerformance: (name: string, fn: () => void) => {
    // Sanitize name to prevent log injection
    const sanitizedName = name.replace(/[\r\n\t]/g, ' ').substring(0, 100);
    
    const start = performance.now();
    fn();
    const end = performance.now();
    
    if (end - start > 100) { // Log slow operations
      console.warn(`Slow operation: ${sanitizedName} took ${Math.round(end - start)}ms`);
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
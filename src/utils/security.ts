// Security utilities for input sanitization and validation
export const security = {
  // Sanitize HTML content to prevent XSS
  sanitizeHtml: (input: string): string => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },

  // Sanitize CSS values
  sanitizeCss: (value: string): string => {
    return value.replace(/[^#a-fA-F0-9\s\-(),.%]/g, '');
  },

  // Validate and sanitize identifiers (IDs, class names, etc.)
  sanitizeId: (id: string): string => {
    return id.replace(/[^a-zA-Z0-9_-]/g, '');
  },

  // Sanitize log messages to prevent log injection
  sanitizeLog: (message: string): string => {
    return message.replace(/[\r\n\t]/g, ' ').substring(0, 500);
  },

  // Validate Bible book names
  validateBookName: (bookName: string): boolean => {
    return /^[a-zA-Z0-9\s\-']+$/.test(bookName) && bookName.length <= 50;
  },

  // Validate translation IDs
  validateTranslationId: (id: string): boolean => {
    return /^[a-zA-Z0-9_-]+$/.test(id) && id.length <= 20;
  },

  // Validate chapter numbers
  validateChapter: (chapter: number): boolean => {
    return Number.isInteger(chapter) && chapter > 0 && chapter <= 200;
  },

  // Validate verse numbers
  validateVerse: (verse: number): boolean => {
    return Number.isInteger(verse) && verse > 0 && verse <= 200;
  },

  // Sanitize search queries
  sanitizeSearchQuery: (query: string): string => {
    return query.replace(/[<>'"&]/g, '').substring(0, 200);
  },

  // Validate URLs
  validateUrl: (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  },

  // Generate secure random nonce for CSP
  generateNonce: (): string => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  // Rate limiting helper
  createRateLimiter: (maxRequests: number, windowMs: number) => {
    const requests = new Map<string, number[]>();
    
    return (key: string): boolean => {
      const now = Date.now();
      const windowStart = now - windowMs;
      
      if (!requests.has(key)) {
        requests.set(key, []);
      }
      
      const keyRequests = requests.get(key)!;
      // Remove old requests outside the window
      const validRequests = keyRequests.filter(time => time > windowStart);
      
      if (validRequests.length >= maxRequests) {
        return false; // Rate limit exceeded
      }
      
      validRequests.push(now);
      requests.set(key, validRequests);
      return true;
    };
  }
};

// CSRF token management
export const csrfToken = {
  generate: (): string => {
    return security.generateNonce();
  },
  
  store: (token: string): void => {
    sessionStorage.setItem('csrf-token', token);
  },
  
  get: (): string | null => {
    return sessionStorage.getItem('csrf-token');
  },
  
  validate: (token: string): boolean => {
    const storedToken = csrfToken.get();
    return storedToken === token && token.length === 32;
  }
};
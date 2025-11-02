# GospelHub Development Guidelines

## Code Quality Standards

### TypeScript Patterns (Found in 5/5 files)
- **Strict Type Safety**: All files use comprehensive TypeScript interfaces and type definitions
- **Interface-First Design**: Complex objects defined with detailed interfaces (Theme, ReadingSession, AppState)
- **Generic Types**: Reusable type patterns like `TextDifference`, `BibleReference`, and `ReadingStats`
- **Type Guards**: Runtime type checking with functions like `isSingleVerse()`
- **Enum Usage**: Structured constants like `NavigationDirection` for type-safe operations

### Import Organization (Found in 5/5 files)
```typescript
// 1. React and external libraries first
import { Fragment, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 2. Internal data and types
import { bibleTranslations, getTranslationById } from "./data";
import { BibleReference, AppState } from "./types";

// 3. Utilities and helpers
import { isSingleVerse } from "./utils/guards";

// 4. Components (grouped by category)
import { LazyAnalyticsDashboard, LazyParallelView } from "./components/lazy/LazyComponents";
```

### State Management Patterns (Found in 4/5 files)
- **useState with TypeScript**: Explicit type annotations for complex state
- **useMemo for Performance**: Expensive calculations cached with dependency arrays
- **useCallback for Handlers**: Event handlers wrapped to prevent unnecessary re-renders
- **Context Providers**: Global state managed through React Context with TypeScript interfaces
- **Local Storage Integration**: Persistent state with error handling and fallbacks

## Component Architecture

### Functional Component Structure (Found in 5/5 files)
```typescript
const ComponentName = () => {
  // 1. State declarations
  const [state, setState] = useState<Type>(initialValue);
  
  // 2. Context and custom hooks
  const { currentTheme } = useTheme();
  
  // 3. Memoized values
  const computedValue = useMemo(() => calculation, [dependencies]);
  
  // 4. Event handlers with useCallback
  const handleEvent = useCallback((param: Type) => {
    // Handler logic
  }, [dependencies]);
  
  // 5. Effects
  useEffect(() => {
    // Effect logic
    return () => cleanup();
  }, [dependencies]);
  
  // 6. Render
  return (
    <motion.div>
      {/* JSX */}
    </motion.div>
  );
};
```

### Lazy Loading Implementation (Found in 3/5 files)
- **LazyWrapper Components**: Consistent lazy loading pattern with Suspense boundaries
- **Dynamic Imports**: Code splitting for performance-critical components
- **Loading States**: Proper fallback components during lazy loading

### Animation Patterns (Found in 3/5 files)
- **Framer Motion Integration**: Consistent animation library usage
- **AnimatePresence**: Proper enter/exit animations for conditional rendering
- **Motion Components**: `motion.div`, `motion.section` for animated elements
- **Transition Configurations**: Standardized duration and easing patterns

## Styling Conventions

### Theme Integration (Found in 4/5 files)
```typescript
// Dynamic styling with theme colors
style={{
  borderColor: currentTheme.colors.border,
  backgroundColor: currentTheme.colors.surface + 'CC', // Alpha transparency
  color: currentTheme.colors.text
}}
```

### CSS Class Patterns (Found in 4/5 files)
- **Tailwind Utility Classes**: Consistent spacing, typography, and layout utilities
- **Responsive Design**: Mobile-first approach with `sm:`, `lg:` breakpoints
- **Theme Transitions**: `theme-transition` class for smooth color changes
- **Conditional Classes**: Dynamic class application based on state

### Accessibility Standards (Found in 4/5 files)
- **ARIA Labels**: Comprehensive `aria-label`, `aria-live`, `role` attributes
- **Semantic HTML**: Proper use of `main`, `section`, `header` elements
- **Skip Links**: Navigation shortcuts for screen readers
- **Keyboard Navigation**: Tab order and focus management
- **Screen Reader Announcements**: Dynamic content updates announced

## Performance Optimization

### Caching Strategies (Found in 4/5 files)
- **Service Worker**: Multi-layer caching (static, dynamic, Bible data)
- **Cache-First Strategy**: Offline-first approach for Bible content
- **Background Sync**: Deferred operations when offline
- **IndexedDB Integration**: Structured data storage for offline functionality

### Memory Management (Found in 3/5 files)
- **Effect Cleanup**: Proper cleanup of event listeners and timers
- **Memoization**: React.memo and useMemo for expensive operations
- **Virtual Scrolling**: Efficient rendering of large lists
- **Lazy Loading**: Component-level code splitting

### Data Processing (Found in 4/5 files)
- **Debounced Operations**: Search inputs with 300ms delay
- **Batch Processing**: Multiple operations grouped for efficiency
- **Preloading**: Next chapter data loaded in background
- **Compression**: Efficient data structures and algorithms

## Error Handling & Resilience

### Try-Catch Patterns (Found in 4/5 files)
```typescript
try {
  const result = await riskyOperation();
  setData(result);
} catch (error) {
  console.error('Operation failed:', error);
  setError(error.message);
} finally {
  setLoading(false);
}
```

### Fallback Strategies (Found in 4/5 files)
- **Default Values**: Fallback data when primary sources fail
- **Offline Handling**: Graceful degradation when network unavailable
- **Loading States**: User feedback during async operations
- **Error Boundaries**: Component-level error isolation

## API & Data Patterns

### Service Classes (Found in 3/5 files)
```typescript
export class ServiceName {
  private property: Type;
  
  constructor(config: ConfigType) {
    this.property = config.value;
  }
  
  async publicMethod(param: Type): Promise<ReturnType> {
    // Implementation
  }
  
  private helperMethod(): Type {
    // Private logic
  }
}
```

### Data Transformation (Found in 4/5 files)
- **Immutable Updates**: Spread operators for state updates
- **Type-Safe Transformations**: Proper typing throughout data pipeline
- **Validation**: Input validation with type guards and schema validation
- **Normalization**: Consistent data structures across components

## Testing & Quality Assurance

### Code Organization (Found in 5/5 files)
- **Single Responsibility**: Each function/component has one clear purpose
- **Pure Functions**: Predictable functions without side effects where possible
- **Dependency Injection**: Services and utilities passed as parameters
- **Modular Architecture**: Clear separation of concerns

### Documentation Standards (Found in 4/5 files)
- **Interface Documentation**: Comprehensive type definitions serve as documentation
- **Comment Strategy**: Explain complex business logic, not obvious code
- **Function Signatures**: Self-documenting through TypeScript types
- **README Integration**: High-level documentation in markdown files

## Security & Privacy

### Data Protection (Found in 3/5 files)
- **Local Storage**: Sensitive data stored locally, not transmitted
- **Input Sanitization**: User inputs properly escaped and validated
- **HTTPS Only**: External resources loaded over secure connections
- **No Tracking**: Privacy-first approach with local analytics only

### Content Security (Found in 2/5 files)
- **XSS Prevention**: Proper escaping of dynamic content
- **Safe HTML**: Controlled rendering of user-generated content
- **Secure Headers**: Appropriate security headers in service worker

## Development Workflow

### File Naming Conventions (Found in 5/5 files)
- **PascalCase**: Component files (App.tsx, ThemeContext.tsx)
- **camelCase**: Utility files (textComparison.ts, index.ts)
- **kebab-case**: Configuration files (sw.js, manifest.json)
- **Descriptive Names**: Clear, purpose-driven file names

### Code Formatting (Found in 5/5 files)
- **Consistent Indentation**: 2-space indentation throughout
- **Line Length**: Reasonable line lengths with proper wrapping
- **Semicolons**: Consistent semicolon usage
- **Trailing Commas**: Used in multi-line structures for cleaner diffs

### Version Control Patterns (Found in 2/5 files)
- **Cache Versioning**: Incremental cache names for service worker updates
- **Feature Flags**: Conditional feature rendering based on state
- **Backward Compatibility**: Graceful handling of data structure changes
# Bible Reader App - Project Structure

## Directory Organization

```
myapp/
├── src/                          # Source code directory
│   ├── api/                      # API layer and data fetching
│   │   ├── bible.ts             # Bible verse and book fetching logic
│   │   └── README.md            # API documentation
│   ├── assets/                   # Static assets
│   │   └── content.png          # Application images
│   ├── components/               # React components
│   │   └── VerseOfTheDay.tsx    # Mobile-optimized verse display component
│   ├── data/                     # Bible translation data
│   │   ├── index.ts             # Translation registry and helpers
│   │   ├── kjv.ts               # King James Version data
│   │   ├── esv.ts               # English Standard Version data
│   │   └── niv.ts               # New International Version data
│   ├── search/                   # Search functionality
│   │   └── index.ts             # Generic search service implementation
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts             # Core interfaces and type guards
│   ├── utils/                    # Utility functions
│   │   ├── guards.ts            # Type guard functions
│   │   └── navigation.ts        # Navigation helper functions
│   ├── App.tsx                   # Main application component
│   ├── main.tsx                  # Application entry point
│   ├── index.css                 # Global styles
│   └── vite-env.d.ts            # Vite environment types
├── .amazonq/rules/memory-bank/   # Documentation and rules
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
├── style.css                     # Additional styles
├── YOUWARE.md                    # Comprehensive project documentation
└── yw_manifest.json             # Project type manifest
```

## Core Components & Relationships

### Application Architecture
- **App.tsx**: Main orchestrator component managing application state and view switching
- **VerseOfTheDay.tsx**: Specialized mobile component for immersive verse reading
- **State Management**: Centralized AppState interface with React hooks

### Data Layer Architecture
- **Translation System**: Modular structure with independent translation files
- **API Layer**: Abstracted data fetching with conditional URL building
- **Search Service**: Generic SearchService class supporting multiple translations

### Type System Architecture
- **Core Types**: BibleReference, NavigationDirection, AppState interfaces
- **Search Types**: Generic SearchResult<T> with BibleSearchResult implementation
- **Type Guards**: Runtime type checking with isSingleVerse() function

## Architectural Patterns

### Component Composition
- Single-responsibility components with clear separation of concerns
- Props-based communication between parent and child components
- Conditional rendering based on application state

### State Management Pattern
- Centralized state in main App component
- Props drilling for state distribution to child components
- Local state for component-specific interactions (search, audio)

### Data Flow Pattern
- Unidirectional data flow from App.tsx to child components
- Event handlers passed as props for state updates
- API calls abstracted through dedicated service layer

### Animation Pattern
- Framer Motion integration with AnimatePresence for smooth transitions
- Staggered animations for list items with calculated delays
- Micro-interactions on user interface elements

## Module Dependencies
- **React Ecosystem**: React 18.3.1, React DOM, React Router DOM
- **Animation**: Framer Motion for smooth transitions and micro-interactions
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **Build System**: Vite with TypeScript support and React plugin
- **UI Components**: Headless UI for accessible component primitives
- **Utilities**: Clsx for conditional class names, Zod for validation
- **State**: Zustand for potential future state management scaling
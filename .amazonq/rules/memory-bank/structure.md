# GospelHub Project Structure

## Directory Architecture

### Root Configuration
```
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite build configuration
├── tsconfig.json         # TypeScript compiler settings
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS processing
└── vercel.json          # Deployment configuration
```

### Source Code Organization (`src/`)

#### Core Application
```
├── App.tsx              # Main application orchestrator
├── main.tsx             # React application entry point
├── index.css            # Global styles and Tailwind imports
└── vite-env.d.ts        # Vite environment type definitions
```

#### Component Architecture (`src/components/`)

**Charts & Visualizations**
```
├── charts/
│   ├── BookProgress.tsx      # Book completion tracking
│   ├── ProgressRing.tsx      # Circular progress indicators
│   ├── ReadingChart.tsx      # Weekly reading statistics
│   ├── ReadingHeatmap.tsx    # Activity heatmap visualization
│   ├── ReadingVelocity.tsx   # Reading speed analytics
│   └── WordCloud.tsx         # Verse word frequency display
```

**Study Tools**
```
├── study/
│   ├── BookIntroduction.tsx       # Book overview and context
│   ├── Commentary.tsx             # Verse commentary display
│   ├── CommentarySidebar.tsx      # Sidebar commentary panel
│   ├── CrossReferenceGraph.tsx    # Visual cross-reference network
│   ├── CrossReferences.tsx        # Related verse references
│   ├── EnhancedVerseText.tsx      # Rich verse display
│   ├── InteractiveWordStudy.tsx   # Interactive word analysis
│   ├── OriginalLanguageTools.tsx  # Hebrew/Greek language tools
│   ├── ParallelView.tsx           # Multi-translation comparison
│   ├── StrongsSearchBox.tsx       # Strong's concordance search
│   ├── WordStudy.tsx              # Word definition and usage
│   ├── WordStudyPanel.tsx         # Word study sidebar
│   ├── WordStudyTooltip.tsx       # Hover word definitions
│   └── XMLWordStudy.tsx           # XML-based word analysis
```

**Performance Optimizations**
```
├── optimized/
│   ├── MemoizedProgressRing.tsx    # Memoized progress components
│   ├── OptimizedBibleReader.tsx    # Performance-optimized reader
│   └── VirtualizedVerseList.tsx    # Virtual scrolling implementation
```

**Compound Components**
```
├── compound/
│   ├── BibleReader.tsx      # Main reading interface
│   └── SearchBox.tsx        # Advanced search component
```

**Lazy Loading**
```
├── lazy/
│   ├── LazyComponents.tsx   # Dynamic component loading
│   └── LazyWrapper.tsx      # Lazy loading wrapper utility
```

#### Data Layer (`src/data/`)

**Bible Translations**
```
├── esv.ts               # English Standard Version data
├── kjv.ts               # King James Version data
├── niv.ts               # New International Version data
├── index.ts             # Translation registry and utilities
├── strongs.ts           # Strong's concordance data
├── strongsGreek.json    # Greek Strong's numbers
├── strongsHebrew.json   # Hebrew Strong's numbers
└── wordMappings.ts      # Word-to-Strong's mappings
```

**XML Data Processing**
```
├── xml/
│   ├── esv/             # ESV XML files
│   ├── kjv/             # KJV XML files
│   ├── genesis.ts       # Genesis book data
│   ├── john.ts          # John gospel data
│   └── index.ts         # XML processing utilities
```

#### Business Logic (`src/`)

**Custom Hooks**
```
├── hooks/
│   ├── useAnimations.ts           # Animation state management
│   ├── useBibleData.ts            # Bible data fetching
│   ├── useBibleXML.ts             # XML data processing
│   ├── useOptimizedBibleData.ts   # Performance-optimized data
│   ├── usePWA.ts                  # Progressive Web App features
│   ├── useReadingProgress.ts      # Reading progress tracking
│   ├── useStrongsSearch.ts        # Strong's concordance search
│   └── useUserPreferences.ts     # User settings management
```

**Services & APIs**
```
├── api/
│   ├── bible.ts         # Bible data API layer
│   └── README.md        # API documentation
├── services/
│   └── BibleXMLService.ts  # XML processing service
```

**Feature Modules**
```
├── analytics/           # Reading analytics and tracking
├── notifications/       # Push notification system
├── performance/         # Performance monitoring
├── readingPlan/        # Reading plan management
├── search/             # Search functionality
├── study/              # Study tools integration
└── themes/             # Theme management system
```

#### Utilities & Types (`src/`)

**Type Definitions**
```
├── types/
│   ├── index.ts                    # Core type definitions
│   └── react-highlight-words.d.ts  # Third-party type declarations
```

**Utility Functions**
```
├── utils/
│   ├── accessibility.ts     # Accessibility helpers
│   ├── guards.ts           # Type guard functions
│   ├── haptics.ts          # Touch feedback utilities
│   ├── navigation.ts       # Navigation helpers
│   ├── offlineSync.ts      # Offline synchronization
│   ├── seo.ts              # SEO optimization utilities
│   └── textComparison.ts   # Text analysis functions
```

**Context Providers**
```
├── contexts/
│   └── ThemeContext.tsx    # Global theme state management
```

**Design System**
```
├── design-system/
│   ├── components.ts       # Reusable component definitions
│   ├── theme.ts           # Theme configuration
│   └── index.ts           # Design system exports
```

### Development Tools

**Storybook Integration**
```
├── .storybook/
│   ├── main.ts            # Storybook configuration
│   └── preview.ts         # Global story settings
├── src/stories/
│   ├── BibleReader.stories.tsx    # Reader component stories
│   ├── Button.stories.tsx         # Button component stories
│   ├── DesignSystem.stories.mdx   # Design system documentation
│   ├── SearchBox.stories.tsx      # Search component stories
│   └── StudyTools.stories.tsx     # Study tools stories
```

**Public Assets**
```
├── public/
│   ├── manifest.json      # PWA manifest
│   ├── offline.html       # Offline fallback page
│   └── sw.js              # Service worker
```

## Architectural Patterns

### Component Organization
- **Feature-based grouping**: Components organized by functionality (charts, study, optimized)
- **Compound components**: Complex UI patterns broken into reusable pieces
- **Lazy loading**: Performance-critical components loaded on demand

### Data Flow Architecture
- **Centralized state**: Context providers for global state management
- **Custom hooks**: Business logic abstracted into reusable hooks
- **Service layer**: API calls and data processing separated from UI components

### Performance Patterns
- **Virtual scrolling**: Large lists rendered efficiently
- **Memoization**: Expensive calculations cached
- **Code splitting**: Dynamic imports for reduced bundle size
- **Service worker**: Offline functionality and caching

### Type Safety
- **Strict TypeScript**: Comprehensive type definitions
- **Type guards**: Runtime type checking utilities
- **Generic interfaces**: Reusable type patterns
- **Third-party declarations**: Custom type definitions for external libraries
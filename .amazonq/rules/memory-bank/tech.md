# GospelHub Technology Stack

## Core Technologies

### Frontend Framework
- **React 18.3.1**: Latest React with concurrent features and automatic batching
- **TypeScript 5.8.3**: Strict type checking with advanced type patterns
- **Vite 7.0.0**: Lightning-fast build tool with HMR and optimized bundling

### Styling & Design
- **Tailwind CSS 3.4.17**: Utility-first CSS framework with custom configuration
- **PostCSS 8.5.6**: CSS processing with autoprefixer for browser compatibility
- **Framer Motion 11.0.8**: Production-ready motion library for animations
- **Styled Components 6.1.8**: CSS-in-JS for dynamic styling

### State Management & Data
- **Zustand 4.4.7**: Lightweight state management solution
- **React Context**: Built-in state management for theme and global state
- **Zod 3.25.67**: TypeScript-first schema validation

### UI Components & Interactions
- **Headless UI 1.7.18**: Unstyled, accessible UI components
- **Lucide React 0.533.0**: Beautiful & consistent icon library
- **React Use 17.6.0**: Collection of essential React hooks
- **Use Gesture 10.3.0**: Touch and mouse gesture recognition
- **React Spring 9.7.3**: Spring-physics based animations

### Performance & Optimization
- **React Window 1.8.8**: Efficient rendering of large lists
- **React Virtualized 9.22.5**: Virtual scrolling for performance
- **React Highlight Words 0.20.0**: Text highlighting with search

### Data Visualization
- **D3.js 7.8.5**: Data-driven document manipulation
- **D3 Force 3.0.0**: Force-directed graph layouts
- **D3 Selection 3.0.0**: DOM selection and manipulation

### 3D Graphics & Physics
- **Three.js 0.179.1**: 3D graphics library for WebGL
- **Cannon ES 0.20.0**: Physics engine for 3D simulations
- **Matter.js 0.20.0**: 2D physics engine for web
- **GSAP 3.13.0**: Professional-grade animation library

### Internationalization
- **i18next 23.10.1**: Internationalization framework
- **React i18next 14.1.0**: React integration for i18next
- **i18next Browser Language Detector 7.2.0**: Automatic language detection

### AI Integration
- **AI SDK 4.3.16**: Vercel AI SDK for AI-powered features
- **OpenAI SDK 1.3.22**: OpenAI API integration

### Routing & Navigation
- **React Router DOM 6.30.1**: Declarative routing for React applications

### Development Tools
- **Storybook 7.6.7**: Tool for building UI components in isolation
- **Storybook React Vite 7.6.7**: Vite integration for Storybook
- **Storybook Addon Essentials 7.6.7**: Essential Storybook addons
- **Storybook Addon Docs 7.6.7**: Documentation addon for Storybook

### Build & Development
- **Vite Plugin React 4.5.2**: Official React plugin for Vite
- **Youware Vite Plugin React 1.0.2**: Custom Youware React plugin

## Development Commands

### Package Management
```bash
npm install                    # Install all dependencies
```

### Development Server
```bash
npm run dev                    # Start development server with HMR
```

### Production Build
```bash
npm run build                  # Create optimized production build
npm run preview                # Preview production build locally
```

### Component Development
```bash
npm run storybook              # Start Storybook development server
npm run build-storybook        # Build Storybook for deployment
```

## Build Configuration

### Vite Configuration (`vite.config.ts`)
- **React Plugin**: Fast refresh and JSX transformation
- **TypeScript Support**: Built-in TypeScript compilation
- **Asset Optimization**: Image compression and format conversion
- **Code Splitting**: Automatic chunk splitting for optimal loading

### TypeScript Configuration (`tsconfig.json`)
- **Strict Mode**: Enabled for maximum type safety
- **Module Resolution**: Node-style module resolution
- **JSX**: React JSX transformation
- **Target**: ES2020 for modern browser support

### Tailwind Configuration (`tailwind.config.js`)
- **Custom Color Palette**: Warm neutrals with amber accents
- **Typography Plugin**: Enhanced text styling utilities
- **Responsive Breakpoints**: Mobile-first responsive design
- **Animation Utilities**: Custom animation classes

### PostCSS Configuration (`postcss.config.js`)
- **Tailwind CSS**: Utility class processing
- **Autoprefixer**: Automatic vendor prefix addition

## Progressive Web App Features

### Service Worker (`public/sw.js`)
- **Caching Strategy**: Cache-first for static assets, network-first for API calls
- **Offline Support**: Fallback pages and cached content
- **Background Sync**: Sync reading progress when connection restored

### Web App Manifest (`public/manifest.json`)
- **Installable**: Add to home screen capability
- **Theme Colors**: Consistent branding across platforms
- **Display Mode**: Standalone app experience
- **Icons**: Multiple sizes for different devices

## Performance Optimizations

### Bundle Optimization
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Route-based and component-based splitting
- **Dynamic Imports**: Lazy loading of heavy components
- **Asset Optimization**: Image compression and modern formats

### Runtime Performance
- **Virtual Scrolling**: Efficient rendering of large lists
- **Memoization**: React.memo and useMemo for expensive operations
- **Debounced Inputs**: Search optimization with 300ms debounce
- **Intersection Observer**: Lazy loading and infinite scroll

### Memory Management
- **Component Cleanup**: Proper cleanup of event listeners and timers
- **Cache Management**: LRU cache for frequently accessed data
- **Garbage Collection**: Avoiding memory leaks in long-running sessions

## Browser Support

### Target Browsers
- **Chrome**: 90+ (primary target)
- **Firefox**: 88+ (full support)
- **Safari**: 14+ (WebKit compatibility)
- **Edge**: 90+ (Chromium-based)

### Mobile Support
- **iOS Safari**: 14+ (touch gestures, PWA features)
- **Chrome Mobile**: 90+ (full feature parity)
- **Samsung Internet**: Latest versions

### Feature Detection
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Polyfills**: Automatic polyfill injection for missing features
- **Graceful Degradation**: Fallbacks for unsupported features

## Deployment Configuration

### Vercel Configuration (`vercel.json`)
- **Build Command**: npm run build
- **Output Directory**: dist
- **Node Version**: 18.x
- **Environment Variables**: Production configuration

### Environment Variables
```bash
VITE_API_BASE_URL=            # API base URL
VITE_ANALYTICS_ID=            # Analytics tracking ID
VITE_SENTRY_DSN=              # Error tracking DSN
```

## Code Quality & Standards

### TypeScript Configuration
- **Strict Type Checking**: No implicit any, strict null checks
- **Path Mapping**: Absolute imports with @ alias
- **Declaration Files**: Custom type definitions for third-party libraries

### Linting & Formatting
- **ESLint**: Code quality and consistency rules
- **Prettier**: Automatic code formatting
- **Husky**: Git hooks for pre-commit checks

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: Feature-level testing
- **E2E Tests**: User journey validation
- **Visual Regression**: Storybook visual testing
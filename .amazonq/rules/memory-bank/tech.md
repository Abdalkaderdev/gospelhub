# Bible Reader App - Technology Stack

## Programming Languages & Versions
- **TypeScript**: ~5.8.3 (primary language for type safety)
- **JavaScript**: ES2022+ (via Vite transpilation)
- **CSS**: CSS3 with Tailwind utility classes
- **HTML**: HTML5 semantic markup

## Core Framework & Libraries
- **React**: 18.3.1 (component-based UI framework)
- **React DOM**: 18.3.1 (DOM rendering)
- **React Router DOM**: 6.30.1 (client-side routing)
- **TypeScript**: ~5.8.3 (static type checking)

## Build System & Development Tools
- **Vite**: 7.0.0 (fast build tool and dev server)
- **@vitejs/plugin-react**: 4.5.2 (React support for Vite)
- **@youware/vite-plugin-react**: 1.0.2 (custom Youware React plugin)
- **Node Types**: 24.0.14 (Node.js type definitions)

## Styling & UI Framework
- **Tailwind CSS**: 3.4.17 (utility-first CSS framework)
- **PostCSS**: 8.5.6 (CSS processing)
- **Autoprefixer**: 10.4.21 (vendor prefix automation)
- **@headlessui/react**: 1.7.18 (accessible UI components)

## Animation & Interaction
- **Framer Motion**: 11.0.8 (animation library)
- **GSAP**: 3.13.0 (advanced animations)
- **Lucide React**: 0.533.0 (icon library)

## Physics & 3D (Available)
- **Three.js**: 0.179.1 (3D graphics library)
- **Cannon-ES**: 0.20.0 (physics engine)
- **Matter.js**: 0.20.0 (2D physics engine)
- **@types/matter-js**: 0.20.0 (Matter.js type definitions)

## AI & Language Processing
- **AI SDK**: 4.3.16 (AI integration utilities)
- **@ai-sdk/openai**: 1.3.22 (OpenAI API integration)
- **i18next**: 23.10.1 (internationalization)
- **i18next-browser-languagedetector**: 7.2.0 (language detection)
- **react-i18next**: 14.1.0 (React i18n integration)

## State Management & Utilities
- **Zustand**: 4.4.7 (lightweight state management)
- **React Use**: 17.6.0 (React hooks collection)
- **Zod**: 3.25.67 (schema validation)
- **Clsx**: 2.1.0 (conditional class names)

## Development Commands

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
# Starts Vite dev server with hot reload
# Typically runs on http://localhost:5173
```

### Production Build
```bash
npm run build
# Creates optimized production build in dist/
# Includes TypeScript compilation and asset optimization
```

### Preview Production Build
```bash
npm run preview
# Serves production build locally for testing
# Useful for verifying build before deployment
```

## Configuration Files
- **package.json**: Dependencies, scripts, and project metadata
- **tailwind.config.js**: Tailwind CSS customization
- **vite.config.ts**: Vite build configuration (implied)
- **tsconfig.json**: TypeScript compiler options (implied)
- **yw_manifest.json**: Youware project type declaration

## Development Environment
- **Node.js**: Required for package management and build tools
- **NPM**: Package manager for dependency installation
- **Modern Browser**: Chrome, Firefox, Safari, Edge for development testing
- **TypeScript Support**: IDE with TypeScript language server recommended

## Build Output
- **Static Assets**: Optimized HTML, CSS, and JavaScript bundles
- **Code Splitting**: Automatic chunking for optimal loading
- **Tree Shaking**: Dead code elimination for smaller bundles
- **Asset Optimization**: Image and font optimization through Vite
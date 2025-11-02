# Bible Reader App Guide

Premium Bible reader built with React 18, TypeScript, Vite, and Tailwind CSS featuring advanced TypeScript patterns, multi-translation support, Framer Motion animations, and mobile-optimized interactions with premium search.

## Development Commands

- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Run production build: `npm run build`
- Preview production build: `npm run preview`

## Architecture Overview

**Main Entry**: `src/App.tsx` orchestrates the entire application with toggle between main reader view and Verse of the Day mobile screen. Uses React hooks for centralized state management (AppState interface) and Framer Motion for smooth animations.

**Components**:
- **App.tsx**: Main reader with book/chapter selection, search, responsive grid layout
- **VerseOfTheDay.tsx**: Mobile-optimized fullscreen verse display with:
  - Swipe gesture navigation (touch handlers for left/right chapter switching)
  - Pinch-to-zoom font scaling (14px–28px range via wheel events)
  - Audio player with word-by-word sync highlighting (300ms word intervals)
  - Premium search with debounced real-time suggestions (300ms debounce, max 8 results)
  - Keyboard navigation for suggestions (Arrow Up/Down, Enter, Escape keys)
  - Loading state indicator with animated pulse
  - Animated UI transitions using Framer Motion motion.div and AnimatePresence

**State Management**:
- Centralized AppState (currentBook, currentChapter, currentVerse)
- Translation context via selectedTranslationId
- Search state for real-time results
- Suggestion dropdown state with keyboard selection index

## Mobile & Interaction Features

**Verse of the Day Screen**:
- Full-screen immersive reading experience
- Touch-based swipe navigation (>50px threshold for chapter changes)
- Ctrl/Cmd + Wheel for pinch-to-zoom font scaling (14px–28px)
- Audio playback with visual word highlighting (300ms per word)
- Previous/Next chapter buttons
- Animated transitions between verses
- Premium search icon in header (magnifying glass)

**Premium Search Feature**:
- Real-time search suggestions as user types (300ms debounce delay)
- Displays up to 8 most relevant results with verse reference and preview text
- Keyboard-navigable dropdown (ArrowUp/Down for navigation, Enter to select, Escape to close)
- Visual feedback with "Searching..." loading state
- "No verses found" message when search yields no results
- Click or keyboard select to view full verse reference in header

**Responsive Design**:
- Mobile-first Tailwind breakpoints (sm:, lg:)
- Touch-friendly button sizes and spacing
- Optimized layout for all screen sizes
- Sticky controls panel on desktop, bottom sheet on mobile

## Animation System

**Framer Motion Integration**:
- Smooth fade/scale transitions for chapter changes (AnimatePresence mode="wait")
- Staggered verse list animations (delay: index * 0.05s)
- Micro-interactions on buttons (whileHover, whileTap)
- Progress bar animation for audio playback
- Subtle opacity animations (swipe hint, loading states)
- Suggestion dropdown animations (fade in/out with scale)
- Loading pulse animation for search state

## Type System (`src/types/index.ts`)

- **BibleReference**: Optional verse for single-verse or full-chapter flexibility
- **NavigationDirection**: Enum (Previous, Next) with type safety
- **AppState**: Centralized state interface (currentBook, currentChapter, currentVerse)
- **BibleVerse**: Structured verse data (book, chapter, verse, text)
- **SearchResult<T>**: Generic search interface for type safety
- **BibleSearchResult**: Search result with reference + verse data + translation name
- **isSingleVerse()**: Type guard function for runtime type checking

## API Layer (`src/api/bible.ts`)

- **fetchBibleVerse()**: Conditional URL building for single verse vs chapter
- **fetchBibleBooks()**: Retrieves available books per translation
- Translation-aware calls with error handling
- Supports in-memory data + future remote API integration

## Search Service (`src/search/index.ts`)

Generic SearchService class:
- **searchBible(query)**: Full-text case-insensitive search across all in-memory verses
- Returns typed SearchResult<BibleSearchResult> with reference + verse data
- Supports multiple translations via constructor parameter
- **getVerse()**: Single verse retrieval for loading references
- **setTranslation()**: Switch between translations on the fly

## Translation System

**Modular Structure**:
- `src/data/kjv.ts`, `src/data/esv.ts`, `src/data/niv.ts`: Independent translation modules
- Each exports BibleTranslation with metadata (id, name, abbreviation, language) + structured verse data
- `src/data/index.ts`: Central registry with bibleTranslations array and getTranslationById() helper
- Dynamic switching via setSelectedTranslationId()
- VerseOfTheDay receives translationId prop for search consistency

## Design System

**Color Palette**:
- Warm neutrals: stone, amber accents
- Gradient backgrounds: stone-50 → amber-50/30 → warm-50
- Glassmorphism panels: white/80 with backdrop blur
- Avoid high-saturation colors (no purple, neon)

**Typography**:
- Dramatic size hierarchy: 7xl headers down to xs labels
- Light font weights (font-light) for premium feel
- Generous line spacing and letter tracking

**Layout**:
- Asymmetrical grid: 5:7 ratio on lg screens
- Sticky sidebar on desktop, full-width mobile
- Rounded 2xl–3xl corners with subtle shadows

## Testing & Deployment

Production build verified with:
- TypeScript compilation (no errors)
- Vite bundle optimization
- Mobile responsive testing
- Gesture handler functionality
- Audio playback sync accuracy
- Search debounce and suggestion rendering

## Current Feature Set

✅ Multi-translation support (KJV, ESV, NIV)  
✅ Advanced TypeScript patterns (type guards, generics, enums)  
✅ Swipe navigation for mobile chapters  
✅ Pinch-to-zoom font scaling (14–28px)  
✅ Audio player with word-by-word highlighting  
✅ Premium search with debounced suggestions  
✅ Keyboard navigation for search results  
✅ Framer Motion smooth animations  
✅ Responsive mobile-first design  
✅ Search across all verses  
✅ Copy-to-clipboard functionality  
✅ Loading states & error handling  

## Future Enhancement Paths

- **Advanced Search**: Add filters for book, chapter range, keyword combinations
- **Recent Searches**: Persist and display recent search queries in localStorage
- **Study Tools**: Parallel Bible view, commentary sections, word studies, cross-references
- **Visual Effects**: Parallax scrolling, floating particles, gradient animations, 3D flips
- **Audio Features**: Sync with Bible audio APIs, playback speed controls, sleep timer
- **Personalization**: User profiles, reading plans, bookmarks, highlights, sharing
- **Backend**: Youware Backend integration for user data persistence & advanced features

## Database & Persistence

Currently client-side in-memory only. Future iterations will use:
- Youware Backend for user accounts, reading progress, bookmarks
- localStorage for offline caching of selected verses and recent searches
- IndexedDB for larger translation caches

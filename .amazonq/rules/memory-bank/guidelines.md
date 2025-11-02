# Bible Reader App - Development Guidelines

## Code Quality Standards

### Import Organization (5/5 files follow this pattern)
- **React imports first**: `useState`, `useRef`, `useEffect`, `useCallback` from "react"
- **Third-party libraries**: Framer Motion, external dependencies
- **Local imports last**: Types, utilities, components in order of dependency depth
- **Consistent import grouping**: Separate groups with blank lines

### TypeScript Patterns (5/5 files exhibit strong typing)
- **Explicit interface definitions**: All props interfaces clearly defined with descriptive names
- **Generic type usage**: `SearchResult<T>` and `BibleSearchResult` for type safety
- **Optional parameters with defaults**: `translationId = "kjv"` pattern used consistently
- **Type guards**: Runtime type checking with `isSingleVerse()` function
- **Enum usage**: `NavigationDirection` enum for type-safe direction handling

### Component Architecture Standards

#### Props Interface Pattern (2/2 components follow this)
```typescript
interface ComponentNameProps {
  requiredProp: Type;
  optionalProp?: Type;
  callbackProp: (param: Type) => void;
}
```

#### State Management Pattern (2/2 components use this approach)
- **Centralized state**: Main state in parent component with clear interface
- **Local component state**: UI-specific state (fontSize, isPlaying, searchOpen)
- **Ref usage**: `useRef` for DOM manipulation and mutable values that don't trigger re-renders
- **Callback optimization**: `useCallback` for expensive operations with proper dependencies

### Animation Implementation Standards (2/2 components use Framer Motion)

#### Motion Component Usage
- **AnimatePresence**: Always use `mode="wait"` for sequential animations
- **Staggered animations**: `delay: index * 0.05` for list item animations
- **Micro-interactions**: `whileHover={{ scale: 1.05 }}` and `whileTap={{ scale: 0.95 }}`
- **Transition consistency**: Duration 0.2-0.5s for UI elements, 0.15s for dropdowns

#### Animation Patterns
- **Loading states**: Pulsing animations with `animate={{ scale: [1, 1.2, 1] }}`
- **Progress indicators**: Width-based animations for progress bars
- **Entrance animations**: `initial={{ opacity: 0, y: -20 }}` with `animate={{ opacity: 1, y: 0 }}`

### Event Handling Patterns (4/5 files implement these)

#### Touch/Gesture Handling
- **Touch threshold**: 50px minimum for swipe detection
- **Ref-based tracking**: `touchStartX.current` for gesture state
- **Gesture calculations**: `Math.abs(diff) > threshold` for reliable detection

#### Keyboard Navigation
- **Switch statements**: Preferred over if-else chains for key handling
- **Event prevention**: `e.preventDefault()` for custom keyboard behavior
- **Index management**: Proper bounds checking for selection indices

#### Debounced Operations (2/2 search implementations use this)
- **Timer management**: `useRef<NodeJS.Timeout | null>(null)` for cleanup
- **300ms delay**: Standard debounce timing for search operations
- **Cleanup pattern**: Always clear existing timers before setting new ones

### Styling Conventions (5/5 files follow these patterns)

#### Tailwind Class Organization
- **Layout first**: `flex`, `grid`, positioning classes
- **Spacing**: `px-4 sm:px-6`, responsive padding/margin
- **Colors**: Stone/amber palette with opacity modifiers
- **Interactive states**: `hover:`, `focus:`, `transition-` classes

#### Design System Adherence
- **Glassmorphism**: `bg-white/80 backdrop-blur` for panels
- **Border radius**: `rounded-xl` to `rounded-3xl` for modern feel
- **Shadow hierarchy**: `shadow-sm` to `shadow-lg` based on elevation
- **Color consistency**: Stone (neutral), amber (accent), warm (background)

### Data Structure Patterns (3/3 data files follow this)

#### Type Definitions
- **Hierarchical types**: `BibleChapterIndex` with nested structure
- **Consistent naming**: `BibleVerse`, `BibleTranslation`, `BibleReference`
- **Export patterns**: Named exports for types, default for main objects

#### Data Organization
- **Modular structure**: Separate files per translation (kjv.ts, esv.ts, niv.ts)
- **Registry pattern**: Central index.ts with `getTranslationById()` helper
- **Metadata inclusion**: id, name, abbreviation, language for each translation

### Service Class Patterns (2/2 service classes follow this)

#### Class Structure
- **Constructor injection**: Translation ID as constructor parameter
- **Private properties**: Internal state management with private fields
- **Method consistency**: Async methods return Promise with proper typing
- **Error handling**: Try-catch blocks with meaningful error messages

#### API Integration
- **Conditional URL building**: Different endpoints based on reference type
- **Response validation**: Check `response.ok` before processing
- **Fallback handling**: Graceful degradation when services unavailable

### Performance Optimization Patterns (3/3 components implement these)

#### Memoization Usage
- **useMemo**: For expensive calculations (bookKeys, chapterOptions, currentVerses)
- **Dependency arrays**: Minimal and accurate dependency tracking
- **Service instances**: Memoized service creation to prevent recreation

#### Efficient Re-rendering
- **Callback optimization**: `useCallback` for event handlers passed as props
- **State structure**: Separate concerns to minimize unnecessary updates
- **Key props**: Unique keys for list items to optimize React reconciliation

### Error Handling Standards (3/3 API-related files implement this)

#### Async Operation Handling
- **Try-catch blocks**: Wrap all async operations
- **Loading states**: Boolean flags for pending operations
- **Error logging**: `console.error` with descriptive messages
- **User feedback**: Loading indicators and "No results" states

#### Validation Patterns
- **Input validation**: Check for empty/invalid inputs before processing
- **Type checking**: Runtime validation with type guard functions
- **Boundary conditions**: Handle edge cases (empty arrays, missing data)

### Component Communication Patterns (2/2 components follow this)

#### Props Drilling
- **Callback props**: Pass event handlers from parent to child
- **State lifting**: Keep shared state in common ancestor
- **Interface consistency**: Standardized prop naming across components

#### State Updates
- **Functional updates**: `setState(prev => ({ ...prev, newValue }))` pattern
- **Immutable updates**: Spread operator for object/array updates
- **Conditional updates**: Check conditions before state changes
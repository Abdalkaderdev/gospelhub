"Implement cross-themed loading animations throughout our Bible React/TypeScript app:

1. Create `CrossLoader` component with 3 variants:
   - **Morphing**: Plus sign (+) morphs into cross (✝) with drawing animation
   - **Particle**: Dots assemble into cross shape with stagger animation  
   - **Neon**: Glowing cross with subtle flicker effect

2. Replace all loading states:
   - Chapter transitions
   - Search results loading
   - Initial app load
   - Data fetching states

3. Use Framer Motion for smooth animations:
   - pathLength animations for drawing effect
   - staggerChildren for sequential animations
   - Glow effects using filter: drop-shadow()

4. TypeScript interface:
```typescript
interface CrossLoaderProps {
  variant: 'morphing' | 'particle' | 'neon';
  size: 'sm' | 'md' | 'lg';
  duration?: number;
}

Build a comprehensive verse highlighting system:

Highlight Engine:

Right-click context menu with 4 color options (yellow, blue, pink, green)

Click-to-highlight with smooth color fill animation

Persistent storage in localStorage with IndexedDB fallback

Highlight Management:

View all highlights in dedicated panel

Filter highlights by color and book

Remove highlights with undo capability

Visual Design:

Subtle background colors that don't obscure text

Smooth transition animations when applying/removing

Small color indicator dot next to highlighted verses

TypeScript Interfaces:

typescript
interface Highlight {
  id: string;
  verseId: string;
  color: HighlightColor;
  timestamp: Date;
  note?: string;
}
Implement reading progress and enhanced navigation:

Reading Progress Bar:

Sticky progress bar at top of screen

Fills smoothly as user scrolls through chapter

Shows percentage and verses read

Gesture Navigation:

Swipe left/right on mobile to change chapters

Visual feedback during swipe gesture

Haptic feedback on mobile devices

Chapter Navigation:

Previous/Next chapter buttons with hover animations

Smooth page transition between chapters

Auto-scroll to top when chapter changes

Progress Tracking:

Track reading time per session

Save last read position

Reading statistics in user profile

Add original language word study tooltips using our local JSON data:

Tooltip System:

Hover over any word to see Hebrew/Greek meaning

Smooth fade-in tooltip with original language data

Click to open expanded word study panel

Data Integration:

Use existing strongsHebrew.json and strongsGreek.json

Local word mapping for common Biblical terms

Fast client-side search through word data

Visual Design:

Elegant tooltip with subtle shadow and arrow

Color-coded by language (blue=Hebrew, red=Greek)

Smooth animations using Framer Motion

Expanded Study Panel:

Slide-up panel with detailed word information

Usage examples and root word analysis

Related words and frequency data
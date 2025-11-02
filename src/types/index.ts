export interface BibleReference {
    book: string;
    chapter: number;
    verse?: number;
  }
  
  export enum NavigationDirection {
    Previous = "previous",
    Next = "next",
  }
  
  export interface AppState {
    currentBook: string;
    currentChapter: number;
    currentVerse: number | "all";
  }
  
  export interface BibleVerse {
    book: string;
    chapter: number;
    verse: number;
    text: string;
  }
  
  export interface BibleChapterIndex {
    [book: string]: {
      chapters: number[];
      verses: {
        [chapter: number]: BibleVerse[];
      };
    };
  }
  
  export interface BibleTranslation {
    id: string;
    name: string;
    abbreviation: string;
    language: string;
    data: BibleChapterIndex;
  }
  
  export interface SearchResult<T> {
    results: T[];
    total: number;
  }
  
  export interface BibleSearchResult {
    reference: BibleReference;
    verse: BibleVerse;
    translation: string;
  }

  // Theme System Types
  export interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  }

  export interface Theme {
    id: string;
    name: string;
    colors: ThemeColors;
    accessibility?: {
      highContrast?: boolean;
      largeText?: boolean;
      reducedMotion?: boolean;
    };
  }

  export type ThemePreset = 'classic' | 'dark' | 'sepia' | 'modern';
  export type SeasonalTheme = 'spring' | 'summer' | 'autumn' | 'winter';

  // Analytics Types
  export interface ReadingSession {
    id: string;
    startTime: Date;
    endTime?: Date;
    book: string;
    chapter: number;
    versesRead: number[];
    duration: number;
    translation: string;
  }

  export interface ReadingStats {
    totalSessions: number;
    totalTime: number;
    booksCompleted: string[];
    chaptersRead: { [book: string]: number[] };
    favoriteBooks: string[];
    readingStreak: number;
    weeklyGoal: number;
    weeklyProgress: number;
  }

  export interface WordFrequency {
    word: string;
    count: number;
    verses: BibleReference[];
  }

  // Performance Types
  export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiry: number;
  }

  export interface PreloadConfig {
    enabled: boolean;
    chaptersAhead: number;
    booksAhead: number;
  }
  
  export function isSingleVerse(reference: BibleReference): reference is BibleReference & { verse: number } {
    return reference.verse !== undefined;
  }
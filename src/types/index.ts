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
    words?: BibleWord[];
  }

  export interface BibleWord {
    text: string;
    strongsNumber?: string;
    morphology?: string;
    lemma?: string;
  }

  export interface BibleBook {
    name: string;
    abbreviation: string;
    chapters: BibleChapter[];
  }

  export interface BibleChapter {
    number: number;
    verses: BibleVerse[];
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
  
  // Study Tools Types
  export interface WordStudy {
    word: string;
    original: string;
    transliteration: string;
    strongsNumber: string;
    definition: string;
    usage: string[];
    etymology: string;
  }

  export interface Commentary {
    id: string;
    author: string;
    title: string;
    content: string;
    reference: BibleReference;
    type: 'verse' | 'chapter' | 'book';
  }

  export interface CrossReference {
    from: BibleReference;
    to: BibleReference;
    relationship: 'parallel' | 'prophecy' | 'fulfillment' | 'theme' | 'quote';
    strength: number;
  }

  export interface BookIntroduction {
    book: string;
    author: string;
    dateWritten: string;
    audience: string;
    purpose: string;
    keyThemes: string[];
    outline: { title: string; chapters: string }[];
    timeline: { event: string; date: string; reference?: string }[];
  }

  export interface ParallelView {
    translations: string[];
    syncScroll: boolean;
    highlightDifferences: boolean;
  }
  
  export function isSingleVerse(reference: BibleReference): reference is BibleReference & { verse: number } {
    return reference.verse !== undefined;
  }
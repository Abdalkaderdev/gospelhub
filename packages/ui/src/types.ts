// Bible data types
export interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
}

export interface BibleBook {
  name: string;
  abbreviation: string;
  chapters: number;
  testament: 'old' | 'new';
  order: number;
}

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: Verse[];
}

// Search types
export interface SearchResult {
  verse: Verse;
  score: number;
  highlights: string[];
}

export interface SearchOptions {
  limit?: number;
  threshold?: number;
  includeHighlights?: boolean;
}

// Storage types
export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

// UI component props
export interface VerseCardProps {
  verse: Verse;
  onBookmark?: (verse: Verse) => void;
  isBookmarked?: boolean;
  className?: string;
}

export interface BibleNavigatorProps {
  onBookSelect: (book: string) => void;
  onChapterSelect: (book: string, chapter: number) => void;
  selectedBook?: string;
  selectedChapter?: number;
  className?: string;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

// Navigation types
export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
}

// App state types
export interface AppState {
  currentBook: string;
  currentChapter: number;
  bookmarks: string[];
  searchQuery: string;
  searchResults: SearchResult[];
  theme: Theme;
  isLoading: boolean;
}

// API types
export interface BibleAPIResponse {
  verses: Verse[];
  total: number;
  page: number;
  limit: number;
}

export interface BibleAPIError {
  message: string;
  code: string;
  status: number;
}
// Enhanced Bible types for metadata and structure features
export interface Testament {
  name: 'Old' | 'New';
  books: Book[];
  bookCount: number;
}

export interface BibleMetadata {
  translation: string;
  status: string;
  copyright?: string;
  language?: string;
  testaments: Testament[];
}

export interface Book {
  number: number;
  name: string;
  abbreviation: string;
  testament: 'Old' | 'New';
  category: BookCategory;
  chapters: Chapter[];
  chapterCount: number;
  verseCount: number;
}

export interface Chapter {
  number: number;
  verses: Verse[];
  verseCount: number;
}

export interface Verse {
  number: number;
  text: string;
  originalText?: string; // Hebrew/Greek
  strongsNumbers?: string[];
  morphology?: string[];
}

export type BookCategory = 'Law' | 'History' | 'Poetry' | 'Prophets' | 'Gospels' | 'Epistles' | 'Apocalyptic';

export const BOOK_CATEGORIES: Record<BookCategory, string[]> = {
  'Law': ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'],
  'History': ['Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther'],
  'Poetry': ['Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon'],
  'Prophets': ['Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'],
  'Gospels': ['Matthew', 'Mark', 'Luke', 'John'],
  'Epistles': ['Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude'],
  'Apocalyptic': ['Revelation']
};

export interface CrossReference {
  from: { book: string; chapter: number; verse: number };
  to: { book: string; chapter: number; verse: number };
  type: 'parallel' | 'prophecy' | 'fulfillment' | 'theme' | 'quote';
  strength: number; // 0-1
}

export interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // days
  category: BookCategory | 'chronological' | 'thematic';
  readings: ReadingPlanDay[];
}

export interface ReadingPlanDay {
  day: number;
  readings: {
    book: string;
    chapter: number;
    verses?: number[];
  }[];
}

export interface TranslationComparison {
  reference: { book: string; chapter: number; verse: number };
  translations: {
    id: string;
    name: string;
    text: string;
    differences?: TextDifference[];
  }[];
}

export interface TextDifference {
  type: 'addition' | 'deletion' | 'substitution';
  position: number;
  length: number;
  text: string;
  alternativeText?: string;
}

export interface AdvancedSearchOptions {
  phrase: boolean;
  wholeWords: boolean;
  caseSensitive: boolean;
  translations: string[];
  books?: string[];
  testament?: 'Old' | 'New';
  category?: BookCategory;
}

export interface SearchResultEnhanced {
  reference: { book: string; chapter: number; verse: number };
  text: string;
  translation: string;
  context: string; // surrounding verses
  relevanceScore: number;
  highlights: { start: number; length: number }[];
}

export interface WordFrequencyAnalysis {
  word: string;
  count: number;
  translations: { id: string; count: number }[];
  books: { name: string; count: number }[];
  verses: { book: string; chapter: number; verse: number }[];
}

export interface ConcordanceEntry {
  word: string;
  strongsNumber?: string;
  definition: string;
  occurrences: {
    book: string;
    chapter: number;
    verse: number;
    text: string;
    translation: string;
  }[];
  relatedWords: string[];
}
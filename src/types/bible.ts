// Generated types for Bible data structure
export interface BibleWord {
  text: string;
  strongsNumber?: string;
  morphology?: string;
  lemma?: string;
}

export interface BibleVerse {
  number: number;
  text: string;
  words?: BibleWord[];
}

export interface BibleChapter {
  number: number;
  verses: BibleVerse[];
}

export interface BibleBook {
  name: string;
  abbreviation: string;
  chapters: BibleChapter[];
}

export interface ProcessedBibleBook {
  abbreviation: string;
  verses: { [chapterNumber: number]: BibleVerse[] };
}

export interface ProcessedTranslation {
  id: string;
  name: string;
  abbreviation: string;
  data: { [bookName: string]: ProcessedBibleBook };
}

export interface TranslationMetadata {
  id: string;
  name: string;
  abbreviation: string;
  language?: string;
  year?: string;
  description?: string;
}

// Validation schemas
export const validateVerse = (verse: any): verse is BibleVerse => {
  return (
    typeof verse === 'object' &&
    typeof verse.number === 'number' &&
    typeof verse.text === 'string'
  );
};

export const validateChapter = (chapter: any): chapter is BibleChapter => {
  return (
    typeof chapter === 'object' &&
    typeof chapter.number === 'number' &&
    Array.isArray(chapter.verses) &&
    chapter.verses.every(validateVerse)
  );
};

export const validateBook = (book: any): book is BibleBook => {
  return (
    typeof book === 'object' &&
    typeof book.name === 'string' &&
    typeof book.abbreviation === 'string' &&
    Array.isArray(book.chapters) &&
    book.chapters.every(validateChapter)
  );
};
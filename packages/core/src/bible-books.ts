import { BibleBook } from './types';

export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { name: 'Genesis', abbreviation: 'Gen', chapters: 50, testament: 'old', order: 1 },
  { name: 'Exodus', abbreviation: 'Exod', chapters: 40, testament: 'old', order: 2 },
  { name: 'Leviticus', abbreviation: 'Lev', chapters: 27, testament: 'old', order: 3 },
  { name: 'Numbers', abbreviation: 'Num', chapters: 36, testament: 'old', order: 4 },
  { name: 'Deuteronomy', abbreviation: 'Deut', chapters: 34, testament: 'old', order: 5 },
  { name: 'Joshua', abbreviation: 'Josh', chapters: 24, testament: 'old', order: 6 },
  { name: 'Judges', abbreviation: 'Judg', chapters: 21, testament: 'old', order: 7 },
  { name: 'Ruth', abbreviation: 'Ruth', chapters: 4, testament: 'old', order: 8 },
  { name: '1 Samuel', abbreviation: '1 Sam', chapters: 31, testament: 'old', order: 9 },
  { name: '2 Samuel', abbreviation: '2 Sam', chapters: 24, testament: 'old', order: 10 },
  { name: '1 Kings', abbreviation: '1 Kgs', chapters: 22, testament: 'old', order: 11 },
  { name: '2 Kings', abbreviation: '2 Kgs', chapters: 25, testament: 'old', order: 12 },
  { name: '1 Chronicles', abbreviation: '1 Chr', chapters: 29, testament: 'old', order: 13 },
  { name: '2 Chronicles', abbreviation: '2 Chr', chapters: 36, testament: 'old', order: 14 },
  { name: 'Ezra', abbreviation: 'Ezra', chapters: 10, testament: 'old', order: 15 },
  { name: 'Nehemiah', abbreviation: 'Neh', chapters: 13, testament: 'old', order: 16 },
  { name: 'Esther', abbreviation: 'Esth', chapters: 10, testament: 'old', order: 17 },
  { name: 'Job', abbreviation: 'Job', chapters: 42, testament: 'old', order: 18 },
  { name: 'Psalms', abbreviation: 'Ps', chapters: 150, testament: 'old', order: 19 },
  { name: 'Proverbs', abbreviation: 'Prov', chapters: 31, testament: 'old', order: 20 },
  { name: 'Ecclesiastes', abbreviation: 'Eccl', chapters: 12, testament: 'old', order: 21 },
  { name: 'Song of Songs', abbreviation: 'Song', chapters: 8, testament: 'old', order: 22 },
  { name: 'Isaiah', abbreviation: 'Isa', chapters: 66, testament: 'old', order: 23 },
  { name: 'Jeremiah', abbreviation: 'Jer', chapters: 52, testament: 'old', order: 24 },
  { name: 'Lamentations', abbreviation: 'Lam', chapters: 5, testament: 'old', order: 25 },
  { name: 'Ezekiel', abbreviation: 'Ezek', chapters: 48, testament: 'old', order: 26 },
  { name: 'Daniel', abbreviation: 'Dan', chapters: 12, testament: 'old', order: 27 },
  { name: 'Hosea', abbreviation: 'Hos', chapters: 14, testament: 'old', order: 28 },
  { name: 'Joel', abbreviation: 'Joel', chapters: 3, testament: 'old', order: 29 },
  { name: 'Amos', abbreviation: 'Amos', chapters: 9, testament: 'old', order: 30 },
  { name: 'Obadiah', abbreviation: 'Obad', chapters: 1, testament: 'old', order: 31 },
  { name: 'Jonah', abbreviation: 'Jonah', chapters: 4, testament: 'old', order: 32 },
  { name: 'Micah', abbreviation: 'Mic', chapters: 7, testament: 'old', order: 33 },
  { name: 'Nahum', abbreviation: 'Nah', chapters: 3, testament: 'old', order: 34 },
  { name: 'Habakkuk', abbreviation: 'Hab', chapters: 3, testament: 'old', order: 35 },
  { name: 'Zephaniah', abbreviation: 'Zeph', chapters: 3, testament: 'old', order: 36 },
  { name: 'Haggai', abbreviation: 'Hag', chapters: 2, testament: 'old', order: 37 },
  { name: 'Zechariah', abbreviation: 'Zech', chapters: 14, testament: 'old', order: 38 },
  { name: 'Malachi', abbreviation: 'Mal', chapters: 4, testament: 'old', order: 39 },

  // New Testament
  { name: 'Matthew', abbreviation: 'Matt', chapters: 28, testament: 'new', order: 40 },
  { name: 'Mark', abbreviation: 'Mark', chapters: 16, testament: 'new', order: 41 },
  { name: 'Luke', abbreviation: 'Luke', chapters: 24, testament: 'new', order: 42 },
  { name: 'John', abbreviation: 'John', chapters: 21, testament: 'new', order: 43 },
  { name: 'Acts', abbreviation: 'Acts', chapters: 28, testament: 'new', order: 44 },
  { name: 'Romans', abbreviation: 'Rom', chapters: 16, testament: 'new', order: 45 },
  { name: '1 Corinthians', abbreviation: '1 Cor', chapters: 16, testament: 'new', order: 46 },
  { name: '2 Corinthians', abbreviation: '2 Cor', chapters: 13, testament: 'new', order: 47 },
  { name: 'Galatians', abbreviation: 'Gal', chapters: 6, testament: 'new', order: 48 },
  { name: 'Ephesians', abbreviation: 'Eph', chapters: 6, testament: 'new', order: 49 },
  { name: 'Philippians', abbreviation: 'Phil', chapters: 4, testament: 'new', order: 50 },
  { name: 'Colossians', abbreviation: 'Col', chapters: 4, testament: 'new', order: 51 },
  { name: '1 Thessalonians', abbreviation: '1 Thess', chapters: 5, testament: 'new', order: 52 },
  { name: '2 Thessalonians', abbreviation: '2 Thess', chapters: 3, testament: 'new', order: 53 },
  { name: '1 Timothy', abbreviation: '1 Tim', chapters: 6, testament: 'new', order: 54 },
  { name: '2 Timothy', abbreviation: '2 Tim', chapters: 4, testament: 'new', order: 55 },
  { name: 'Titus', abbreviation: 'Titus', chapters: 3, testament: 'new', order: 56 },
  { name: 'Philemon', abbreviation: 'Phlm', chapters: 1, testament: 'new', order: 57 },
  { name: 'Hebrews', abbreviation: 'Heb', chapters: 13, testament: 'new', order: 58 },
  { name: 'James', abbreviation: 'James', chapters: 5, testament: 'new', order: 59 },
  { name: '1 Peter', abbreviation: '1 Pet', chapters: 5, testament: 'new', order: 60 },
  { name: '2 Peter', abbreviation: '2 Pet', chapters: 3, testament: 'new', order: 61 },
  { name: '1 John', abbreviation: '1 John', chapters: 5, testament: 'new', order: 62 },
  { name: '2 John', abbreviation: '2 John', chapters: 1, testament: 'new', order: 63 },
  { name: '3 John', abbreviation: '3 John', chapters: 1, testament: 'new', order: 64 },
  { name: 'Jude', abbreviation: 'Jude', chapters: 1, testament: 'new', order: 65 },
  { name: 'Revelation', abbreviation: 'Rev', chapters: 22, testament: 'new', order: 66 },
];

export function getBookByName(name: string): BibleBook | undefined {
  return BIBLE_BOOKS.find(book => 
    book.name.toLowerCase() === name.toLowerCase() ||
    book.abbreviation.toLowerCase() === name.toLowerCase()
  );
}

export function getBooksByTestament(testament: 'old' | 'new'): BibleBook[] {
  return BIBLE_BOOKS.filter(book => book.testament === testament);
}

export function getBookOrder(bookName: string): number {
  const book = getBookByName(bookName);
  return book?.order ?? 0;
}
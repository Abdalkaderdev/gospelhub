export interface BookInfo {
  name: string;
  chapters: number;
  testament: 'Old Testament' | 'New Testament';
  category: string;
}

export interface ChapterReference {
  book: string;
  chapter: number;
}

// Bible book data with chapter counts
const BIBLE_BOOKS: Record<string, BookInfo> = {
  'Genesis': { name: 'Genesis', chapters: 50, testament: 'Old Testament', category: 'Law' },
  'Exodus': { name: 'Exodus', chapters: 40, testament: 'Old Testament', category: 'Law' },
  'Leviticus': { name: 'Leviticus', chapters: 27, testament: 'Old Testament', category: 'Law' },
  'Numbers': { name: 'Numbers', chapters: 36, testament: 'Old Testament', category: 'Law' },
  'Deuteronomy': { name: 'Deuteronomy', chapters: 34, testament: 'Old Testament', category: 'Law' },
  'Joshua': { name: 'Joshua', chapters: 24, testament: 'Old Testament', category: 'History' },
  'Judges': { name: 'Judges', chapters: 21, testament: 'Old Testament', category: 'History' },
  'Ruth': { name: 'Ruth', chapters: 4, testament: 'Old Testament', category: 'History' },
  '1 Samuel': { name: '1 Samuel', chapters: 31, testament: 'Old Testament', category: 'History' },
  '2 Samuel': { name: '2 Samuel', chapters: 24, testament: 'Old Testament', category: 'History' },
  '1 Kings': { name: '1 Kings', chapters: 22, testament: 'Old Testament', category: 'History' },
  '2 Kings': { name: '2 Kings', chapters: 25, testament: 'Old Testament', category: 'History' },
  '1 Chronicles': { name: '1 Chronicles', chapters: 29, testament: 'Old Testament', category: 'History' },
  '2 Chronicles': { name: '2 Chronicles', chapters: 36, testament: 'Old Testament', category: 'History' },
  'Ezra': { name: 'Ezra', chapters: 10, testament: 'Old Testament', category: 'History' },
  'Nehemiah': { name: 'Nehemiah', chapters: 13, testament: 'Old Testament', category: 'History' },
  'Esther': { name: 'Esther', chapters: 10, testament: 'Old Testament', category: 'History' },
  'Job': { name: 'Job', chapters: 42, testament: 'Old Testament', category: 'Wisdom' },
  'Psalms': { name: 'Psalms', chapters: 150, testament: 'Old Testament', category: 'Wisdom' },
  'Proverbs': { name: 'Proverbs', chapters: 31, testament: 'Old Testament', category: 'Wisdom' },
  'Ecclesiastes': { name: 'Ecclesiastes', chapters: 12, testament: 'Old Testament', category: 'Wisdom' },
  'Song of Songs': { name: 'Song of Songs', chapters: 8, testament: 'Old Testament', category: 'Wisdom' },
  'Isaiah': { name: 'Isaiah', chapters: 66, testament: 'Old Testament', category: 'Prophets' },
  'Jeremiah': { name: 'Jeremiah', chapters: 52, testament: 'Old Testament', category: 'Prophets' },
  'Lamentations': { name: 'Lamentations', chapters: 5, testament: 'Old Testament', category: 'Prophets' },
  'Ezekiel': { name: 'Ezekiel', chapters: 48, testament: 'Old Testament', category: 'Prophets' },
  'Daniel': { name: 'Daniel', chapters: 12, testament: 'Old Testament', category: 'Prophets' },
  'Hosea': { name: 'Hosea', chapters: 14, testament: 'Old Testament', category: 'Prophets' },
  'Joel': { name: 'Joel', chapters: 3, testament: 'Old Testament', category: 'Prophets' },
  'Amos': { name: 'Amos', chapters: 9, testament: 'Old Testament', category: 'Prophets' },
  'Obadiah': { name: 'Obadiah', chapters: 1, testament: 'Old Testament', category: 'Prophets' },
  'Jonah': { name: 'Jonah', chapters: 4, testament: 'Old Testament', category: 'Prophets' },
  'Micah': { name: 'Micah', chapters: 7, testament: 'Old Testament', category: 'Prophets' },
  'Nahum': { name: 'Nahum', chapters: 3, testament: 'Old Testament', category: 'Prophets' },
  'Habakkuk': { name: 'Habakkuk', chapters: 3, testament: 'Old Testament', category: 'Prophets' },
  'Zephaniah': { name: 'Zephaniah', chapters: 3, testament: 'Old Testament', category: 'Prophets' },
  'Haggai': { name: 'Haggai', chapters: 2, testament: 'Old Testament', category: 'Prophets' },
  'Zechariah': { name: 'Zechariah', chapters: 14, testament: 'Old Testament', category: 'Prophets' },
  'Malachi': { name: 'Malachi', chapters: 4, testament: 'Old Testament', category: 'Prophets' },
  'Matthew': { name: 'Matthew', chapters: 28, testament: 'New Testament', category: 'Gospels' },
  'Mark': { name: 'Mark', chapters: 16, testament: 'New Testament', category: 'Gospels' },
  'Luke': { name: 'Luke', chapters: 24, testament: 'New Testament', category: 'Gospels' },
  'John': { name: 'John', chapters: 21, testament: 'New Testament', category: 'Gospels' },
  'Acts': { name: 'Acts', chapters: 28, testament: 'New Testament', category: 'History' },
  'Romans': { name: 'Romans', chapters: 16, testament: 'New Testament', category: 'Epistles' },
  '1 Corinthians': { name: '1 Corinthians', chapters: 16, testament: 'New Testament', category: 'Epistles' },
  '2 Corinthians': { name: '2 Corinthians', chapters: 13, testament: 'New Testament', category: 'Epistles' },
  'Galatians': { name: 'Galatians', chapters: 6, testament: 'New Testament', category: 'Epistles' },
  'Ephesians': { name: 'Ephesians', chapters: 6, testament: 'New Testament', category: 'Epistles' },
  'Philippians': { name: 'Philippians', chapters: 4, testament: 'New Testament', category: 'Epistles' },
  'Colossians': { name: 'Colossians', chapters: 4, testament: 'New Testament', category: 'Epistles' },
  '1 Thessalonians': { name: '1 Thessalonians', chapters: 5, testament: 'New Testament', category: 'Epistles' },
  '2 Thessalonians': { name: '2 Thessalonians', chapters: 3, testament: 'New Testament', category: 'Epistles' },
  '1 Timothy': { name: '1 Timothy', chapters: 6, testament: 'New Testament', category: 'Epistles' },
  '2 Timothy': { name: '2 Timothy', chapters: 4, testament: 'New Testament', category: 'Epistles' },
  'Titus': { name: 'Titus', chapters: 3, testament: 'New Testament', category: 'Epistles' },
  'Philemon': { name: 'Philemon', chapters: 1, testament: 'New Testament', category: 'Epistles' },
  'Hebrews': { name: 'Hebrews', chapters: 13, testament: 'New Testament', category: 'Epistles' },
  'James': { name: 'James', chapters: 5, testament: 'New Testament', category: 'Epistles' },
  '1 Peter': { name: '1 Peter', chapters: 5, testament: 'New Testament', category: 'Epistles' },
  '2 Peter': { name: '2 Peter', chapters: 3, testament: 'New Testament', category: 'Epistles' },
  '1 John': { name: '1 John', chapters: 5, testament: 'New Testament', category: 'Epistles' },
  '2 John': { name: '2 John', chapters: 1, testament: 'New Testament', category: 'Epistles' },
  '3 John': { name: '3 John', chapters: 1, testament: 'New Testament', category: 'Epistles' },
  'Jude': { name: 'Jude', chapters: 1, testament: 'New Testament', category: 'Epistles' },
  'Revelation': { name: 'Revelation', chapters: 22, testament: 'New Testament', category: 'Apocalypse' },
};

const BOOK_ORDER = Object.keys(BIBLE_BOOKS);

export function getBookInfo(book: string): BookInfo | null {
  return BIBLE_BOOKS[book] || null;
}

export function getNextChapter(book: string, chapter: number): ChapterReference | null {
  const bookInfo = getBookInfo(book);
  if (!bookInfo) return null;

  if (chapter < bookInfo.chapters) {
    return { book, chapter: chapter + 1 };
  }

  const currentIndex = BOOK_ORDER.indexOf(book);
  if (currentIndex === -1 || currentIndex === BOOK_ORDER.length - 1) {
    return null;
  }

  const nextBook = BOOK_ORDER[currentIndex + 1];
  return { book: nextBook, chapter: 1 };
}

export function getPreviousChapter(book: string, chapter: number): ChapterReference | null {
  const bookInfo = getBookInfo(book);
  if (!bookInfo) return null;

  if (chapter > 1) {
    return { book, chapter: chapter - 1 };
  }

  const currentIndex = BOOK_ORDER.indexOf(book);
  if (currentIndex === -1 || currentIndex === 0) {
    return null;
  }

  const previousBook = BOOK_ORDER[currentIndex - 1];
  const previousBookInfo = getBookInfo(previousBook);
  if (!previousBookInfo) return null;

  return { book: previousBook, chapter: previousBookInfo.chapters };
}

export function formatReference(book: string, chapter: number, verse?: number, endVerse?: number): string {
  if (verse === undefined) {
    return `${book} ${chapter}`;
  }

  if (endVerse && endVerse !== verse) {
    return `${book} ${chapter}:${verse}-${endVerse}`;
  }

  return `${book} ${chapter}:${verse}`;
}

export function getAllBooks(): BookInfo[] {
  return Object.values(BIBLE_BOOKS);
}

export function getBooksByTestament(testament: 'Old Testament' | 'New Testament'): BookInfo[] {
  return Object.values(BIBLE_BOOKS).filter(book => book.testament === testament);
}

export function getBooksByCategory(category: string): BookInfo[] {
  return Object.values(BIBLE_BOOKS).filter(book => book.category === category);
}
import { BibleMetadata, Testament, Book, BookCategory, BOOK_CATEGORIES } from '../types/bible-enhanced';

export class BibleMetadataService {
  private static bookNames = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings',
    '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther',
    'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
    'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
    'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum',
    'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
    'Matthew', 'Mark', 'Luke', 'John', 'Acts',
    'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
    'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
    '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
    'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
  ];

  static parseXMLMetadata(xmlContent: string): BibleMetadata {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlContent, 'text/xml');
    
    const bibleElement = doc.querySelector('bible');
    const translation = bibleElement?.getAttribute('translation') || 'Unknown';
    const status = bibleElement?.getAttribute('status') || 'Unknown';
    
    const testaments = this.extractTestaments(doc);
    
    return {
      translation,
      status,
      testaments
    };
  }

  private static extractTestaments(doc: Document): Testament[] {
    const testamentElements = doc.querySelectorAll('testament');
    return Array.from(testamentElements).map(testament => {
      const name = testament.getAttribute('name') as 'Old' | 'New';
      const books = this.extractBooks(testament, name);
      
      return {
        name,
        books,
        bookCount: books.length
      };
    });
  }

  private static extractBooks(testament: Element, testamentName: 'Old' | 'New'): Book[] {
    const bookElements = testament.querySelectorAll('book');
    return Array.from(bookElements).map((book, index) => {
      const number = parseInt(book.getAttribute('number') || '0');
      const bookName = this.getBookName(number);
      const category = this.getBookCategory(bookName);
      const chapters = this.extractChapters(book);
      
      return {
        number,
        name: bookName,
        abbreviation: this.getBookAbbreviation(bookName),
        testament: testamentName,
        category,
        chapters,
        chapterCount: chapters.length,
        verseCount: chapters.reduce((total, ch) => total + ch.verseCount, 0)
      };
    });
  }

  private static extractChapters(book: Element) {
    const chapterElements = book.querySelectorAll('chapter');
    return Array.from(chapterElements).map(chapter => {
      const number = parseInt(chapter.getAttribute('number') || '0');
      const verseElements = chapter.querySelectorAll('verse');
      const verses = Array.from(verseElements).map(verse => ({
        number: parseInt(verse.getAttribute('number') || '0'),
        text: verse.textContent || ''
      }));
      
      return {
        number,
        verses,
        verseCount: verses.length
      };
    });
  }

  private static getBookName(number: number): string {
    return this.bookNames[number - 1] || `Book ${number}`;
  }

  private static getBookCategory(bookName: string): BookCategory {
    for (const [category, books] of Object.entries(BOOK_CATEGORIES)) {
      if (books.includes(bookName)) {
        return category as BookCategory;
      }
    }
    return 'History'; // default
  }

  private static getBookAbbreviation(bookName: string): string {
    const abbreviations: Record<string, string> = {
      'Genesis': 'Gen', 'Exodus': 'Exo', 'Leviticus': 'Lev', 'Numbers': 'Num', 'Deuteronomy': 'Deu',
      'Joshua': 'Jos', 'Judges': 'Jdg', 'Ruth': 'Rut', '1 Samuel': '1Sa', '2 Samuel': '2Sa',
      '1 Kings': '1Ki', '2 Kings': '2Ki', '1 Chronicles': '1Ch', '2 Chronicles': '2Ch',
      'Ezra': 'Ezr', 'Nehemiah': 'Neh', 'Esther': 'Est', 'Job': 'Job', 'Psalms': 'Psa',
      'Proverbs': 'Pro', 'Ecclesiastes': 'Ecc', 'Song of Solomon': 'Son', 'Isaiah': 'Isa',
      'Jeremiah': 'Jer', 'Lamentations': 'Lam', 'Ezekiel': 'Eze', 'Daniel': 'Dan',
      'Hosea': 'Hos', 'Joel': 'Joe', 'Amos': 'Amo', 'Obadiah': 'Oba', 'Jonah': 'Jon',
      'Micah': 'Mic', 'Nahum': 'Nah', 'Habakkuk': 'Hab', 'Zephaniah': 'Zep',
      'Haggai': 'Hag', 'Zechariah': 'Zec', 'Malachi': 'Mal', 'Matthew': 'Mat',
      'Mark': 'Mar', 'Luke': 'Luk', 'John': 'Joh', 'Acts': 'Act', 'Romans': 'Rom',
      '1 Corinthians': '1Co', '2 Corinthians': '2Co', 'Galatians': 'Gal', 'Ephesians': 'Eph',
      'Philippians': 'Phi', 'Colossians': 'Col', '1 Thessalonians': '1Th', '2 Thessalonians': '2Th',
      '1 Timothy': '1Ti', '2 Timothy': '2Ti', 'Titus': 'Tit', 'Philemon': 'Phm',
      'Hebrews': 'Heb', 'James': 'Jam', '1 Peter': '1Pe', '2 Peter': '2Pe',
      '1 John': '1Jo', '2 John': '2Jo', '3 John': '3Jo', 'Jude': 'Jud', 'Revelation': 'Rev'
    };
    return abbreviations[bookName] || bookName.substring(0, 3);
  }

  static getTestamentBooks(testament: 'Old' | 'New'): string[] {
    const oldTestament = this.bookNames.slice(0, 39);
    const newTestament = this.bookNames.slice(39);
    return testament === 'Old' ? oldTestament : newTestament;
  }

  static getBooksByCategory(category: BookCategory): string[] {
    return BOOK_CATEGORIES[category] || [];
  }

  static getCategoryForBook(bookName: string): BookCategory | null {
    for (const [category, books] of Object.entries(BOOK_CATEGORIES)) {
      if (books.includes(bookName)) {
        return category as BookCategory;
      }
    }
    return null;
  }
}
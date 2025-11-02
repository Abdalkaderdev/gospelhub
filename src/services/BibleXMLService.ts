import { BibleBook, BibleChapter, BibleVerse, BibleWord } from '../types';

class BibleXMLService {
  private cache = new Map<string, BibleBook[]>();

  async loadTranslation(translationId: string): Promise<BibleBook[]> {
    if (this.cache.has(translationId)) {
      return this.cache.get(translationId)!;
    }

    try {
      // Import the XML file dynamically
      const xmlModule = await import(`../data/xml/${translationId}.xml?raw`);
      const xmlText = xmlModule.default;
      const books = this.parseXML(xmlText);
      this.cache.set(translationId, books);
      return books;
    } catch (error) {
      console.warn(`Failed to load ${translationId} from XML:`, error);
      throw error;
    }
  }

  async loadBook(translationId: string, bookName: string): Promise<BibleBook | null> {
    try {
      const books = await this.loadTranslation(translationId);
      return books.find(book => 
        book.name.toLowerCase() === bookName.toLowerCase() ||
        book.abbreviation.toLowerCase() === bookName.toLowerCase()
      ) || null;
    } catch {
      return null;
    }
  }

  private parseXML(xmlText: string): BibleBook[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    const books: BibleBook[] = [];

    const bookElements = doc.querySelectorAll('book');
    bookElements.forEach(bookEl => {
      const book: BibleBook = {
        name: bookEl.getAttribute('name') || '',
        abbreviation: bookEl.getAttribute('abbr') || '',
        chapters: []
      };

      const chapterElements = bookEl.querySelectorAll('chapter');
      chapterElements.forEach(chapterEl => {
        const chapter: BibleChapter = {
          number: parseInt(chapterEl.getAttribute('number') || '1'),
          verses: []
        };

        const verseElements = chapterEl.querySelectorAll('verse');
        verseElements.forEach(verseEl => {
          const verse: BibleVerse = {
            number: parseInt(verseEl.getAttribute('number') || '1'),
            text: verseEl.textContent || '',
            words: this.parseWords(verseEl)
          };
          chapter.verses.push(verse);
        });

        book.chapters.push(chapter);
      });

      books.push(book);
    });

    return books;
  }

  private parseWords(verseElement: Element): BibleWord[] {
    const words: BibleWord[] = [];
    const wordElements = verseElement.querySelectorAll('w');
    
    wordElements.forEach(wordEl => {
      const word: BibleWord = {
        text: wordEl.textContent || '',
        strongsNumber: wordEl.getAttribute('strongs') || undefined,
        morphology: wordEl.getAttribute('morph') || undefined,
        lemma: wordEl.getAttribute('lemma') || undefined
      };
      words.push(word);
    });

    return words;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const bibleXMLService = new BibleXMLService();
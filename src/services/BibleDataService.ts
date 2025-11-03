import translations from '../data/processed/index';

export interface BibleVerse {
  number: number;
  text: string;
}

export interface BibleChapter {
  [verseNumber: string]: BibleVerse[];
}

export interface BibleBook {
  [chapterNumber: string]: BibleVerse[];
}

export interface BibleData {
  [bookName: string]: BibleBook;
}

export interface Translation {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
}

class BibleDataService {
  private cache = new Map<string, BibleData>();
  private loadingPromises = new Map<string, Promise<BibleData>>();

  getTranslations(): Translation[] {
    return translations;
  }

  getTranslation(id: string): Translation | undefined {
    return translations.find(t => t.id === id);
  }

  async loadTranslation(translationId: string): Promise<BibleData> {
    if (this.cache.has(translationId)) {
      return this.cache.get(translationId)!;
    }

    if (this.loadingPromises.has(translationId)) {
      return this.loadingPromises.get(translationId)!;
    }

    const loadPromise = this.fetchTranslation(translationId);
    this.loadingPromises.set(translationId, loadPromise);

    try {
      const data = await loadPromise;
      this.cache.set(translationId, data);
      this.loadingPromises.delete(translationId);
      return data;
    } catch (error) {
      this.loadingPromises.delete(translationId);
      throw error;
    }
  }

  private async fetchTranslation(translationId: string): Promise<BibleData> {
    try {
      const response = await fetch(`/src/data/processed/${translationId}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${translationId}`);
      }
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error(`Error loading translation ${translationId}:`, error);
      throw error;
    }
  }

  async getChapter(translationId: string, book: string, chapter: number): Promise<BibleVerse[]> {
    const data = await this.loadTranslation(translationId);
    return data[book]?.[chapter.toString()] || [];
  }

  async searchVerses(translationId: string, query: string, limit = 50): Promise<Array<{
    book: string;
    chapter: number;
    verse: BibleVerse;
  }>> {
    const data = await this.loadTranslation(translationId);
    const results: Array<{ book: string; chapter: number; verse: BibleVerse }> = [];
    const searchTerm = query.toLowerCase();

    for (const [book, chapters] of Object.entries(data)) {
      for (const [chapterNum, verses] of Object.entries(chapters)) {
        for (const verse of verses) {
          if (verse.text.toLowerCase().includes(searchTerm)) {
            results.push({
              book,
              chapter: parseInt(chapterNum),
              verse
            });
            if (results.length >= limit) return results;
          }
        }
      }
    }

    return results;
  }

  getBookNames(translationId?: string): string[] {
    if (translationId && this.cache.has(translationId)) {
      return Object.keys(this.cache.get(translationId)!);
    }
    
    // Default book names
    return [
      'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
      'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
      '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
      'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
      'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
      'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
      'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
      'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
      'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans',
      '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
      'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
      '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
      'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
      'Jude', 'Revelation'
    ];
  }
}

export const bibleDataService = new BibleDataService();
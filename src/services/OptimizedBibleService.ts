import { BibleBook, BibleTranslation } from '../types';

interface ProcessedTranslation {
  id: string;
  name: string;
  abbreviation: string;
  data: { [bookName: string]: { verses: { [chapter: number]: any[] } } };
}

class OptimizedBibleService {
  private cache = new Map<string, ProcessedTranslation>();
  private bookCache = new Map<string, any>();
  private availableTranslations: { id: string; name: string; abbreviation: string }[] = [];

  async initialize() {
    try {
      const indexModule = await import('../data/processed/index');
      this.availableTranslations = indexModule.default;
    } catch (error) {
      console.warn('Processed translations not found, falling back to XML');
    }
  }

  async loadTranslation(translationId: string): Promise<ProcessedTranslation | null> {
    if (this.cache.has(translationId)) {
      return this.cache.get(translationId)!;
    }

    // Validate translation ID to prevent code injection
    if (!/^[a-zA-Z0-9_-]+$/.test(translationId)) {
      console.warn(`Invalid translation ID: ${translationId}`);
      return null;
    }

    try {
      // For now, return null since we don't have processed translations as TS files
      return null;
    } catch (error) {
      console.warn(`Failed to load processed translation ${translationId}:`, error);
      return null;
    }
  }

  async loadBook(translationId: string, bookName: string): Promise<any | null> {
    // Validate inputs to prevent injection attacks
    if (!/^[a-zA-Z0-9_-]+$/.test(translationId) || !/^[a-zA-Z0-9_\s-]+$/.test(bookName)) {
      console.warn(`Invalid translation ID or book name: ${translationId}, ${bookName}`);
      return null;
    }

    const cacheKey = `${translationId}:${bookName}`;
    
    if (this.bookCache.has(cacheKey)) {
      return this.bookCache.get(cacheKey);
    }

    const translation = await this.loadTranslation(translationId);
    if (!translation || !translation.data[bookName]) {
      return null;
    }

    const book = translation.data[bookName];
    this.bookCache.set(cacheKey, book);
    return book;
  }

  async loadChapter(translationId: string, bookName: string, chapterNumber: number): Promise<any[] | null> {
    const book = await this.loadBook(translationId, bookName);
    return book?.verses[chapterNumber] || null;
  }

  getAvailableTranslations() {
    return this.availableTranslations;
  }

  clearCache() {
    this.cache.clear();
    this.bookCache.clear();
  }

  // Memory management
  pruneCache(maxSize: number = 50) {
    if (this.cache.size > maxSize) {
      const entries = Array.from(this.cache.entries());
      const toRemove = entries.slice(0, entries.length - maxSize);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }

    if (this.bookCache.size > maxSize * 2) {
      const entries = Array.from(this.bookCache.entries());
      const toRemove = entries.slice(0, entries.length - maxSize * 2);
      toRemove.forEach(([key]) => this.bookCache.delete(key));
    }
  }
}

export const optimizedBibleService = new OptimizedBibleService();
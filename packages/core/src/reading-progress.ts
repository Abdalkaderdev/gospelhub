import { StorageManager } from './storage';

export interface ReadingProgress {
  book: string;
  chapter: number;
  lastRead: Date;
  progress: number; // 0-1, percentage of book read
}

export class ReadingProgressManager {
  private storage: StorageManager;

  constructor(storage: StorageManager) {
    this.storage = storage;
  }

  async getProgress(): Promise<Record<string, ReadingProgress>> {
    const progressData = await this.storage.getReadingProgress();
    const progress: Record<string, ReadingProgress> = {};
    
    for (const [book, chapter] of Object.entries(progressData)) {
      progress[book] = {
        book,
        chapter,
        lastRead: new Date(),
        progress: 0 // Would calculate based on chapters read
      };
    }
    
    return progress;
  }

  async updateProgress(book: string, chapter: number): Promise<void> {
    await this.storage.updateReadingProgress(book, chapter);
  }

  async getCurrentPosition(): Promise<{ book: string; chapter: number } | null> {
    const progress = await this.storage.getReadingProgress();
    const entries = Object.entries(progress);
    
    if (entries.length === 0) return null;
    
    // Return the most recently read book/chapter
    const [book, chapter] = entries[entries.length - 1];
    return { book, chapter };
  }

  async getBookProgress(book: string): Promise<number> {
    const progress = await this.storage.getReadingProgress();
    const chapter = progress[book] || 0;
    
    // Get total chapters for the book
    const { BIBLE_BOOKS, getBookByName } = await import('./bible-books');
    const bookData = getBookByName(book);
    
    if (!bookData) return 0;
    
    return chapter / bookData.chapters;
  }
}
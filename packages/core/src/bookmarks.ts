import { Verse } from './types';
import { StorageManager } from './storage';

export class BookmarkManager {
  private storage: StorageManager;

  constructor(storage: StorageManager) {
    this.storage = storage;
  }

  async getBookmarks(): Promise<Verse[]> {
    const bookmarkRefs = await this.storage.getBookmarks();
    // In a real app, you'd fetch the actual verse objects
    // For now, we'll return empty array as we don't have a verse lookup by reference
    return [];
  }

  async addBookmark(verse: Verse): Promise<void> {
    await this.storage.addBookmark(verse.reference);
  }

  async removeBookmark(verseReference: string): Promise<void> {
    await this.storage.removeBookmark(verseReference);
  }

  async isBookmarked(verseReference: string): Promise<boolean> {
    return await this.storage.isBookmarked(verseReference);
  }

  async getBookmarkReferences(): Promise<string[]> {
    return await this.storage.getBookmarks();
  }
}
import { StorageAdapter } from './types';

// Web Storage Adapter (localStorage)
export class WebStorageAdapter implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
    }
  }

  async clear(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

// Mobile Storage Adapter (AsyncStorage)
export class MobileStorageAdapter implements StorageAdapter {
  private asyncStorage: any;

  constructor() {
    // This will be dynamically imported in mobile apps
    this.asyncStorage = null;
  }

  async init() {
    if (typeof window === 'undefined') {
      try {
        // Dynamic import with error handling - this will be available in mobile apps
        const AsyncStorageModule = await eval('import("@react-native-async-storage/async-storage")').catch(() => null);
        this.asyncStorage = AsyncStorageModule?.default;
      } catch (error) {
        console.error('AsyncStorage not available:', error);
      }
    }
  }

  async getItem(key: string): Promise<string | null> {
    if (!this.asyncStorage) return null;
    try {
      return await this.asyncStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from AsyncStorage:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    if (!this.asyncStorage) return;
    try {
      await this.asyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in AsyncStorage:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    if (!this.asyncStorage) return;
    try {
      await this.asyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from AsyncStorage:', error);
    }
  }

  async clear(): Promise<void> {
    if (!this.asyncStorage) return;
    try {
      await this.asyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  }
}

// Storage Manager
export class StorageManager {
  private adapter: StorageAdapter;

  constructor(adapter: StorageAdapter) {
    this.adapter = adapter;
  }

  // Bookmarks
  async getBookmarks(): Promise<string[]> {
    const bookmarks = await this.adapter.getItem('bookmarks');
    return bookmarks ? JSON.parse(bookmarks) : [];
  }

  async addBookmark(verseReference: string): Promise<void> {
    const bookmarks = await this.getBookmarks();
    if (!bookmarks.includes(verseReference)) {
      bookmarks.push(verseReference);
      await this.adapter.setItem('bookmarks', JSON.stringify(bookmarks));
    }
  }

  async removeBookmark(verseReference: string): Promise<void> {
    const bookmarks = await this.getBookmarks();
    const filtered = bookmarks.filter(ref => ref !== verseReference);
    await this.adapter.setItem('bookmarks', JSON.stringify(filtered));
  }

  async isBookmarked(verseReference: string): Promise<boolean> {
    const bookmarks = await this.getBookmarks();
    return bookmarks.includes(verseReference);
  }

  // Reading Progress
  async getReadingProgress(): Promise<Record<string, number>> {
    const progress = await this.adapter.getItem('readingProgress');
    return progress ? JSON.parse(progress) : {};
  }

  async updateReadingProgress(book: string, chapter: number): Promise<void> {
    const progress = await this.getReadingProgress();
    progress[book] = chapter;
    await this.adapter.setItem('readingProgress', JSON.stringify(progress));
  }

  // Settings
  async getSettings(): Promise<Record<string, any>> {
    const settings = await this.adapter.getItem('settings');
    return settings ? JSON.parse(settings) : {};
  }

  async updateSettings(settings: Record<string, any>): Promise<void> {
    const currentSettings = await this.getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    await this.adapter.setItem('settings', JSON.stringify(updatedSettings));
  }

  // Theme
  async getTheme(): Promise<string> {
    const settings = await this.getSettings();
    return settings.theme || 'system';
  }

  async setTheme(theme: string): Promise<void> {
    await this.updateSettings({ theme });
  }

  // Reading plan progress methods
  async saveReadingProgress(progress: any): Promise<void> {
    const allProgress = await this.getReadingPlanProgress();
    allProgress[progress.planId] = progress;
    await this.adapter.setItem('reading-plan-progress', JSON.stringify(allProgress));
  }

  async getReadingPlanProgress(): Promise<Record<string, any>> {
    try {
      const data = await this.adapter.getItem('reading-plan-progress');
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  async deleteReadingProgress(planId: string): Promise<void> {
    const allProgress = await this.getReadingPlanProgress();
    delete allProgress[planId];
    await this.adapter.setItem('reading-plan-progress', JSON.stringify(allProgress));
  }

  // Promise data methods
  async savePromiseData(data: any): Promise<void> {
    await this.adapter.setItem('promise-data', JSON.stringify(data));
  }

  async getPromiseData(): Promise<any> {
    try {
      const data = await this.adapter.getItem('promise-data');
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  // Bag items methods
  async saveBagItems(items: any[]): Promise<void> {
    await this.adapter.setItem('bag-items', JSON.stringify(items));
  }

  async getBagItems(): Promise<any[]> {
    try {
      const data = await this.adapter.getItem('bag-items');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // Dictionary data methods
  async saveDictionaryData(data: any): Promise<void> {
    await this.adapter.setItem('dictionary-data', JSON.stringify(data));
  }

  async getDictionaryData(): Promise<any> {
    try {
      const data = await this.adapter.getItem('dictionary-data');
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }
}
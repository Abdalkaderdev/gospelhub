interface SyncData {
  id: string;
  type: 'bookmark' | 'highlight';
  data: any;
  timestamp: number;
}

class OfflineSyncManager {
  private dbName = 'GospelHubDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('syncData')) {
          const store = db.createObjectStore('syncData', { keyPath: 'key' });
          store.createIndex('type', 'type', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('bookmarks')) {
          const bookmarkStore = db.createObjectStore('bookmarks', { keyPath: 'id' });
          bookmarkStore.createIndex('book', 'book', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('highlights')) {
          const highlightStore = db.createObjectStore('highlights', { keyPath: 'id' });
          highlightStore.createIndex('book', 'book', { unique: false });
        }
      };
    });
  }

  async addBookmark(bookmark: { id: string; book: string; chapter: number; verse?: number; note?: string }): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['bookmarks', 'syncData'], 'readwrite');
    
    // Store bookmark locally
    const bookmarkStore = transaction.objectStore('bookmarks');
    bookmarkStore.put({ ...bookmark, timestamp: Date.now() });
    
    // Queue for sync
    const syncStore = transaction.objectStore('syncData');
    const pendingBookmarks = await this.getPendingData('pendingBookmarks') || [];
    pendingBookmarks.push(bookmark);
    syncStore.put({ key: 'pendingBookmarks', data: pendingBookmarks });
    
    // Trigger background sync if available
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-bookmarks');
    }
  }

  async addHighlight(highlight: { id: string; book: string; chapter: number; verse: number; text: string; color: string }): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['highlights', 'syncData'], 'readwrite');
    
    // Store highlight locally
    const highlightStore = transaction.objectStore('highlights');
    highlightStore.put({ ...highlight, timestamp: Date.now() });
    
    // Queue for sync
    const syncStore = transaction.objectStore('syncData');
    const pendingHighlights = await this.getPendingData('pendingHighlights') || [];
    pendingHighlights.push(highlight);
    syncStore.put({ key: 'pendingHighlights', data: pendingHighlights });
    
    // Trigger background sync if available
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-highlights');
    }
  }

  async getBookmarks(): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['bookmarks'], 'readonly');
      const store = transaction.objectStore('bookmarks');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getHighlights(): Promise<any[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['highlights'], 'readonly');
      const store = transaction.objectStore('highlights');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async removeBookmark(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['bookmarks'], 'readwrite');
    const store = transaction.objectStore('bookmarks');
    store.delete(id);
  }

  async removeHighlight(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['highlights'], 'readwrite');
    const store = transaction.objectStore('highlights');
    store.delete(id);
  }

  private async getPendingData(key: string): Promise<any[]> {
    if (!this.db) return [];
    
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['syncData'], 'readonly');
      const store = transaction.objectStore('syncData');
      const request = store.get(key);
      
      request.onsuccess = () => {
        resolve(request.result?.data || []);
      };
      request.onerror = () => resolve([]);
    });
  }

  async cacheChapter(book: string, chapter: number, data: any): Promise<void> {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_BIBLE_CHAPTER',
        book,
        chapter,
        data
      });
    }
  }

  async clearCache(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
  }

  async getCacheSize(): Promise<number> {
    if (!('caches' in window)) return 0;
    
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }
    
    return totalSize;
  }
}

export const offlineSyncManager = new OfflineSyncManager();
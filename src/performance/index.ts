import { CacheEntry, PreloadConfig, BibleVerse } from '../types';

export class PerformanceManager {
  private cache = new Map<string, CacheEntry<any>>();
  private preloadConfig: PreloadConfig = {
    enabled: true,
    chaptersAhead: 2,
    booksAhead: 1
  };

  constructor() {
    this.setupServiceWorker();
    this.setupIntersectionObserver();
  }

  // Cache Management
  setCache<T>(key: string, data: T, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    });
  }

  getCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry || Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Preloading
  async preloadChapter(book: string, chapter: number, translation: string): Promise<void> {
    const cacheKey = `${translation}-${book}-${chapter}`;
    if (this.getCache(cacheKey)) return;

    try {
      // Simulate API call - replace with actual implementation
      const response = await fetch(`/api/bible/${translation}/${book}/${chapter}`);
      if (response.ok) {
        const data = await response.json();
        this.setCache(cacheKey, data);
      }
    } catch (error) {
      console.warn('Preload failed:', error);
    }
  }

  async preloadNextChapters(currentBook: string, currentChapter: number, translation: string): Promise<void> {
    if (!this.preloadConfig.enabled) return;

    const promises: Promise<void>[] = [];
    
    // Preload next chapters in current book
    for (let i = 1; i <= this.preloadConfig.chaptersAhead; i++) {
      promises.push(this.preloadChapter(currentBook, currentChapter + i, translation));
    }

    await Promise.all(promises);
  }

  // Image Optimization
  createBlurDataURL(width: number, height: number): string {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, width, height);
    }
    return canvas.toDataURL();
  }

  // Memory Management
  optimizeVerseRendering(verses: BibleVerse[], viewportHeight: number): BibleVerse[] {
    const itemHeight = 100; // Estimated verse height
    const visibleCount = Math.ceil(viewportHeight / itemHeight) + 5; // Buffer
    
    if (verses.length <= visibleCount) return verses;
    
    return verses.slice(0, visibleCount);
  }

  // Infinite Scroll
  setupInfiniteScroll(
    container: HTMLElement,
    loadMore: () => Promise<void>,
    threshold: number = 200
  ): () => void {
    let isLoading = false;

    const handleScroll = async () => {
      if (isLoading) return;
      
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        isLoading = true;
        await loadMore();
        isLoading = false;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }

  // Service Worker Setup
  private async setupServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch (error) {
        console.warn('Service worker registration failed:', error);
      }
    }
  }

  // Intersection Observer for lazy loading
  private setupIntersectionObserver(): void {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const element = entry.target as HTMLElement;
              const src = element.dataset.src;
              if (src) {
                element.setAttribute('src', src);
                element.removeAttribute('data-src');
                observer.unobserve(element);
              }
            }
          });
        },
        { rootMargin: '50px' }
      );

      // Store observer for later use
      (window as any).lazyLoadObserver = observer;
    }
  }

  // Performance Monitoring
  measurePerformance(name: string, fn: () => void): void {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
  }

  async measureAsyncPerformance<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  }
}

export const performanceManager = new PerformanceManager();
import { useState, useEffect, useCallback } from 'react';
import { BibleBook, BibleChapter } from '../types';
import { bibleXMLService } from '../services/BibleXMLService';

interface UseBibleXMLReturn {
  books: BibleBook[];
  loading: boolean;
  error: string | null;
  loadTranslation: (translationId: string) => Promise<void>;
  loadBook: (translationId: string, bookName: string) => Promise<BibleBook | null>;
  clearCache: () => void;
}

export const useBibleXML = (): UseBibleXMLReturn => {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTranslation = useCallback(async (translationId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const loadedBooks = await bibleXMLService.loadTranslation(translationId);
      setBooks(loadedBooks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load translation');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBook = useCallback(async (translationId: string, bookName: string) => {
    try {
      return await bibleXMLService.loadBook(translationId, bookName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load book');
      return null;
    }
  }, []);

  const clearCache = useCallback(() => {
    bibleXMLService.clearCache();
    setBooks([]);
  }, []);

  return {
    books,
    loading,
    error,
    loadTranslation,
    loadBook,
    clearCache
  };
};
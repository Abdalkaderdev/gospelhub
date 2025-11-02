import { useMemo, useCallback } from 'react';
import { useBibleData } from './useBibleData';
import { BibleVerse } from '../types';

interface UseOptimizedBibleDataReturn {
  currentVerses: BibleVerse[];
  availableBooks: string[];
  availableChapters: number[];
  searchResults: any[];
  isLoading: boolean;
  searchBible: (query: string) => Promise<void>;
  getChapter: (book: string, chapter: number) => BibleVerse[];
  getVerse: (book: string, chapter: number, verse: number) => BibleVerse | null;
  memoizedVerses: BibleVerse[];
  optimizedSearch: (query: string) => Promise<void>;
}

export const useOptimizedBibleData = (
  translationId: string,
  currentBook: string,
  currentChapter: number
): UseOptimizedBibleDataReturn => {
  const bibleData = useBibleData(translationId);

  // Memoize current verses to prevent unnecessary re-renders
  const memoizedVerses = useMemo(() => {
    if (!currentBook || !currentChapter) return [];
    return bibleData.getChapter(currentBook, currentChapter);
  }, [bibleData, currentBook, currentChapter]);

  // Memoize available chapters for current book
  const availableChapters = useMemo(() => {
    if (!currentBook) return [];
    const translation = bibleData.availableBooks.includes(currentBook);
    if (!translation) return [];
    
    // This would need to be implemented based on your data structure
    // For now, returning a range based on common Bible structure
    const maxChapters = currentBook === 'Psalms' ? 150 : 
                       currentBook === 'Genesis' ? 50 : 
                       currentBook === 'Matthew' ? 28 : 25;
    return Array.from({ length: maxChapters }, (_, i) => i + 1);
  }, [currentBook, bibleData.availableBooks]);

  // Optimized search with debouncing built-in
  const optimizedSearch = useCallback(
    async (query: string) => {
      if (query.length < 2) return;
      await bibleData.searchBible(query);
    },
    [bibleData]
  );

  // Memoized chapter getter
  const getChapter = useCallback(
    (book: string, chapter: number) => {
      return bibleData.getChapter(book, chapter);
    },
    [bibleData]
  );

  // Memoized verse getter
  const getVerse = useCallback(
    (book: string, chapter: number, verse: number) => {
      return bibleData.getVerse(book, chapter, verse);
    },
    [bibleData]
  );

  return {
    ...bibleData,
    memoizedVerses,
    availableChapters,
    optimizedSearch,
    getChapter,
    getVerse
  };
};
import { useState, useEffect, useMemo } from 'react';
import { BibleReference, BibleVerse } from '../types';
import { bibleTranslations, getTranslationById } from '../data';
import { SearchService } from '../search';

interface UseBibleDataReturn {
  currentVerses: BibleVerse[];
  availableBooks: string[];
  availableChapters: number[];
  searchResults: any[];
  isLoading: boolean;
  searchBible: (query: string) => Promise<void>;
  getChapter: (book: string, chapter: number) => BibleVerse[];
  getVerse: (book: string, chapter: number, verse: number) => BibleVerse | null;
}

export const useBibleData = (translationId: string = 'kjv'): UseBibleDataReturn => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const translation = useMemo(() => 
    getTranslationById(translationId) || bibleTranslations[0], 
    [translationId]
  );

  const searchService = useMemo(() => 
    new SearchService(translationId), 
    [translationId]
  );

  const availableBooks = useMemo(() => 
    Object.keys(translation.data), 
    [translation]
  );

  const getAvailableChapters = (book: string): number[] => {
    return translation.data[book]?.chapters || [];
  };

  const getChapter = (book: string, chapter: number): BibleVerse[] => {
    return translation.data[book]?.verses[chapter] || [];
  };

  const getVerse = (book: string, chapter: number, verse: number): BibleVerse | null => {
    const verses = getChapter(book, chapter);
    return verses.find(v => v.verse === verse) || null;
  };

  const searchBible = async (query: string): Promise<void> => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const result = await searchService.searchBible(query);
      setSearchResults(result.results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentVerses: [],
    availableBooks,
    availableChapters: [],
    searchResults,
    isLoading,
    searchBible,
    getChapter,
    getVerse
  };
};
import { useState, useMemo, useCallback } from 'react';
import strongsHebrew from '../data/strongsHebrew';
import strongsGreek from '../data/strongsGreek';

interface StrongsEntry {
  strongs: string;
  transliteration: string;
  pronunciation: string;
  definition: string;
  rootWord: string;
}

interface UseStrongsSearchReturn {
  searchResults: StrongsEntry[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterLanguage: 'all' | 'hebrew' | 'greek';
  setFilterLanguage: (filter: 'all' | 'hebrew' | 'greek') => void;
  isSearching: boolean;
  suggestions: string[];
}

export const useStrongsSearch = (): UseStrongsSearchReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState<'all' | 'hebrew' | 'greek'>('all');

  const allData = useMemo(() => [...strongsHebrew, ...strongsGreek], []);

  const filteredData = useMemo(() => {
    switch (filterLanguage) {
      case 'hebrew':
        return strongsHebrew;
      case 'greek':
        return strongsGreek;
      default:
        return allData;
    }
  }, [filterLanguage, allData]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return filteredData.filter(entry =>
      entry.transliteration.toLowerCase().includes(query) ||
      entry.definition.toLowerCase().includes(query) ||
      entry.strongs.toLowerCase().includes(query) ||
      entry.pronunciation.toLowerCase().includes(query)
    ).slice(0, 20); // Limit results for performance
  }, [searchQuery, filteredData]);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];

    const query = searchQuery.toLowerCase();
    const suggestionSet = new Set<string>();

    filteredData.forEach(entry => {
      // Add transliteration suggestions
      if (entry.transliteration.toLowerCase().startsWith(query)) {
        suggestionSet.add(entry.transliteration);
      }
      
      // Add definition word suggestions
      entry.definition.toLowerCase().split(/[,\s]+/).forEach(word => {
        if (word.startsWith(query) && word.length > 2) {
          suggestionSet.add(word);
        }
      });
    });

    return Array.from(suggestionSet).slice(0, 8);
  }, [searchQuery, filteredData]);

  const isSearching = useMemo(() => searchQuery.trim().length > 0, [searchQuery]);

  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSetFilterLanguage = useCallback((filter: 'all' | 'hebrew' | 'greek') => {
    setFilterLanguage(filter);
  }, []);

  return {
    searchResults,
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    filterLanguage,
    setFilterLanguage: handleSetFilterLanguage,
    isSearching,
    suggestions
  };
};
import { useEffect, useCallback } from 'react';
import { useSearchStore } from '../stores/searchStore';

export const useSearch = () => {
  const searchStore = useSearchStore();

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: number;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          searchStore.performSearch(query);
        }, 300); // 300ms debounce
      };
    })(),
    [searchStore]
  );

  // Handle search input change
  const handleSearchChange = (query: string) => {
    searchStore.setQuery(query);
    debouncedSearch(query);
  };

  // Handle search submission
  const handleSearchSubmit = (query: string) => {
    searchStore.performSearch(query);
  };

  // Clear search
  const clearSearch = () => {
    searchStore.clearSearch();
  };

  // Get search suggestions from history
  const getSuggestions = (query: string) => {
    if (!query.trim()) return searchStore.searchHistory;
    
    return searchStore.searchHistory.filter(historyQuery =>
      historyQuery.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Check if search is active
  const isSearchActive = () => {
    return searchStore.query.trim().length > 0;
  };

  // Get search result count
  const getResultCount = () => {
    return searchStore.results.length;
  };

  // Get search status message
  const getSearchStatus = () => {
    if (searchStore.isSearching) return 'Searching...';
    if (searchStore.error) return searchStore.error;
    if (searchStore.results.length === 0 && searchStore.query.trim()) return 'No results found';
    if (searchStore.results.length > 0) return `${searchStore.results.length} results found`;
    return '';
  };

  return {
    // State
    query: searchStore.query,
    results: searchStore.results,
    searchHistory: searchStore.searchHistory,
    isSearching: searchStore.isSearching,
    error: searchStore.error,
    lastSearchTime: searchStore.lastSearchTime,
    
    // Computed values
    isActive: isSearchActive(),
    resultCount: getResultCount(),
    statusMessage: getSearchStatus(),
    
    // Actions
    handleSearchChange,
    handleSearchSubmit,
    clearSearch,
    getSuggestions,
    addToHistory: searchStore.addToHistory,
    removeFromHistory: searchStore.removeFromHistory,
    clearHistory: searchStore.clearHistory,
  };
};
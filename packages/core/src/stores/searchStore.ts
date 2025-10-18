import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SearchResult } from '../types';

interface SearchState {
  query: string;
  results: SearchResult[];
  searchHistory: string[];
  isSearching: boolean;
  error: string | null;
  lastSearchTime: number | null;
}

interface SearchActions {
  setQuery: (query: string) => void;
  setResults: (results: SearchResult[]) => void;
  addToHistory: (query: string) => void;
  clearHistory: () => void;
  removeFromHistory: (query: string) => void;
  setSearching: (searching: boolean) => void;
  setError: (error: string | null) => void;
  performSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
  reset: () => void;
}

type SearchStore = SearchState & SearchActions;

const initialState: SearchState = {
  query: '',
  results: [],
  searchHistory: [],
  isSearching: false,
  error: null,
  lastSearchTime: null,
};

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setQuery: (query: string) => {
        set({ query });
      },

      setResults: (results: SearchResult[]) => {
        set({ results, lastSearchTime: Date.now() });
      },

      addToHistory: (query: string) => {
        const { searchHistory } = get();
        const trimmedQuery = query.trim();
        
        if (trimmedQuery && !searchHistory.includes(trimmedQuery)) {
          const newHistory = [trimmedQuery, ...searchHistory].slice(0, 10); // Keep last 10 searches
          set({ searchHistory: newHistory });
        }
      },

      clearHistory: () => {
        set({ searchHistory: [] });
      },

      removeFromHistory: (query: string) => {
        const { searchHistory } = get();
        const newHistory = searchHistory.filter(q => q !== query);
        set({ searchHistory: newHistory });
      },

      setSearching: (searching: boolean) => {
        set({ isSearching: searching });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      performSearch: async (query: string) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
          set({ results: [], query: '', isSearching: false });
          return;
        }

        set({ query: trimmedQuery, isSearching: true, error: null });

        try {
          const { BibleSearch } = await import('../search');
          const { BibleDataService } = await import('../bible-data-enhanced');
          
          const service = BibleDataService.getInstance();
          const allVerses = service.getAllVerses();
          const search = new BibleSearch(allVerses);
          
          const results = search.search(trimmedQuery, { 
            limit: 50,
            threshold: 0.6
          });

          set({ 
            results, 
            isSearching: false,
            lastSearchTime: Date.now()
          });

          // Add to search history
          get().addToHistory(trimmedQuery);
        } catch (error) {
          set({ 
            error: 'Search failed. Please try again.',
            isSearching: false 
          });
        }
      },

      clearSearch: () => {
        set({ 
          query: '', 
          results: [], 
          isSearching: false, 
          error: null 
        });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'bible-search-storage',
      partialize: (state) => ({
        searchHistory: state.searchHistory,
      }),
    }
  )
);
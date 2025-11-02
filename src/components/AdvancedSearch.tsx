import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Highlighter from 'react-highlight-words';
import { SearchService, SearchFilters } from '../search';
import { BibleSearchResult } from '../types';
import { triggerHaptic, isMobileDevice } from '../utils/haptics';
import { CrossLoader } from './CrossLoader';

interface AdvancedSearchProps {
  searchService: SearchService;
  currentTheme: any;
  onResultClick: (book: string, chapter: number, verse: number) => void;
}

export const AdvancedSearch = ({ searchService, currentTheme, onResultClick }: AdvancedSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BibleSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    testament: 'all',
    book: '',
    phraseMatch: false
  });
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const availableBooks = searchService.getAvailableBooks();

  const performSearch = useCallback(async (searchQuery: string, searchFilters: SearchFilters) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const result = await searchService.searchBible(searchQuery, searchFilters);
      setResults(result.results);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchService]);

  const debouncedSearch = useCallback((searchQuery: string, searchFilters: SearchFilters) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      performSearch(searchQuery, searchFilters);
    }, 300);
  }, [performSearch]);

  useEffect(() => {
    debouncedSearch(query, filters);
  }, [query, filters, debouncedSearch]);

  const handleResultClick = (result: BibleSearchResult) => {
    if (isMobileDevice()) {
      triggerHaptic('selection');
    }
    onResultClick(result.verse.book, result.verse.chapter, result.verse.verse);
    setIsExpanded(false);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search Scripture..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          className="w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2"
          style={{
            borderColor: currentTheme.colors.border,
            backgroundColor: currentTheme.colors.surface,
            color: currentTheme.colors.text,
            '--tw-ring-color': currentTheme.colors.primary
          }}
        />
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <CrossLoader 
              variant="neon"
              size={16}
              color={currentTheme.colors.primary}
              duration={1.5}
            />
          </div>
        )}
      </div>

      {/* Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border"
            style={{
              borderColor: currentTheme.colors.border,
              backgroundColor: currentTheme.colors.background
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <select
              value={filters.testament}
              onChange={(e) => setFilters(prev => ({ ...prev, testament: e.target.value as any }))}
              className="px-3 py-2 rounded-lg border text-sm"
              style={{
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text
              }}
            >
              <option value="all">All Testament</option>
              <option value="old">Old Testament</option>
              <option value="new">New Testament</option>
            </select>

            <select
              value={filters.book}
              onChange={(e) => setFilters(prev => ({ ...prev, book: e.target.value }))}
              className="px-3 py-2 rounded-lg border text-sm"
              style={{
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text
              }}
            >
              <option value="">All Books</option>
              {availableBooks.map(book => (
                <option key={book} value={book}>{book}</option>
              ))}
            </select>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.phraseMatch}
                onChange={(e) => setFilters(prev => ({ ...prev, phraseMatch: e.target.checked }))}
                className="rounded"
              />
              <span style={{ color: currentTheme.colors.text }}>Exact phrase</span>
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            className="space-y-2 max-h-96 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {results.map((result, index) => (
              <motion.div
                key={`${result.verse.book}-${result.verse.chapter}-${result.verse.verse}`}
                className="p-4 rounded-xl border cursor-pointer hover:shadow-md transition-shadow"
                style={{
                  borderColor: currentTheme.colors.border,
                  backgroundColor: currentTheme.colors.surface
                }}
                onClick={() => handleResultClick(result)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span 
                    className="text-sm font-medium"
                    style={{ color: currentTheme.colors.primary }}
                  >
                    {result.verse.book} {result.verse.chapter}:{result.verse.verse}
                  </span>
                  <span 
                    className="text-xs"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    {result.translation}
                  </span>
                </div>
                
                <Highlighter
                  highlightClassName="bg-yellow-200 px-1 rounded"
                  searchWords={filters.phraseMatch ? [query] : query.split(' ')}
                  autoEscape={true}
                  textToHighlight={result.verse.text}
                  className="text-sm leading-relaxed"
                  style={{ color: currentTheme.colors.text }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results */}
      {query.trim() && !isLoading && results.length === 0 && (
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p style={{ color: currentTheme.colors.textSecondary }}>
            No results found for "{query}"
          </p>
        </motion.div>
      )}
    </div>
  );
};
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { isOldTestament } from '../utils/bibleBooks';

interface SearchResult {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  testament: 'old' | 'new';
}

interface BibleSearchProps {
  translations: Record<string, any>;
  onResultClick: (book: string, chapter: number, verse: number) => void;
  currentBook?: string;
  currentChapter?: number;
}

export const BibleSearch: React.FC<BibleSearchProps> = ({
  translations,
  onResultClick,
  currentBook,
  currentChapter
}) => {
  const { currentTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'old' | 'new' | 'current'>('all');
  const [showHistory, setShowHistory] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('search-history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, filter, translations]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    const searchResults: SearchResult[] = [];

    Object.entries(translations).forEach(([translationId, translationData]) => {
      if (!translationData?.data) return;

      Object.entries(translationData.data).forEach(([book, bookData]: [string, any]) => {
        const testament = isOldTestament(book) ? 'old' : 'new';
        
        // Apply filters
        if (filter === 'old' && testament !== 'old') return;
        if (filter === 'new' && testament !== 'new') return;
        if (filter === 'current' && book !== currentBook) return;

        if (bookData?.verses) {
          Object.entries(bookData.verses).forEach(([chapterNum, verses]: [string, any]) => {
            if (Array.isArray(verses)) {
              verses.forEach((verseData, index) => {
                if (verseData?.text?.toLowerCase().includes(searchQuery.toLowerCase())) {
                  searchResults.push({
                    book,
                    chapter: parseInt(chapterNum),
                    verse: index + 1,
                    text: verseData.text,
                    translation: translationId,
                    testament
                  });
                }
              });
            }
          });
        }
      });
    });

    setResults(searchResults.slice(0, 50)); // Limit results
    setLoading(false);
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.length >= 2 && !history.includes(searchQuery)) {
      const newHistory = [searchQuery, ...history.slice(0, 9)];
      setHistory(newHistory);
      localStorage.setItem('search-history', JSON.stringify(newHistory));
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark 
          key={index}
          className="px-1 rounded"
          style={{ 
            backgroundColor: currentTheme.colors.accent + '40',
            color: currentTheme.colors.text
          }}
        >
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={searchRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowHistory(true)}
          placeholder="Search Bible verses..."
          className="w-full px-4 py-3 pr-12 rounded-lg border transition-all focus:outline-none focus:ring-2"
          style={{
            backgroundColor: currentTheme.colors.surface,
            borderColor: currentTheme.colors.border,
            color: currentTheme.colors.text,
            focusRingColor: currentTheme.colors.primary + '40'
          }}
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {loading && (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          )}
          <button
            onClick={() => setQuery('')}
            className="text-sm hover:opacity-70"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mt-3">
        {[
          { key: 'all', label: 'All' },
          { key: 'old', label: 'Old Testament' },
          { key: 'new', label: 'New Testament' },
          { key: 'current', label: 'Current Book' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className="px-3 py-1 text-xs rounded-full border transition-all"
            style={{
              backgroundColor: filter === key ? currentTheme.colors.primary : 'transparent',
              borderColor: currentTheme.colors.border,
              color: filter === key ? 'white' : currentTheme.colors.textSecondary
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search History */}
      <AnimatePresence>
        {showHistory && history.length > 0 && query.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-lg border shadow-lg z-50 max-h-48 overflow-y-auto"
            style={{
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.border
            }}
          >
            <div className="p-2">
              <div className="text-xs font-medium mb-2" style={{ color: currentTheme.colors.textSecondary }}>
                Recent Searches
              </div>
              {history.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(item);
                    setShowHistory(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm rounded hover:bg-opacity-50 transition-colors"
                  style={{ 
                    color: currentTheme.colors.text,
                    backgroundColor: 'transparent'
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 space-y-2 max-h-96 overflow-y-auto"
          >
            <div className="text-sm mb-3" style={{ color: currentTheme.colors.textSecondary }}>
              {results.length} results found
            </div>
            
            {results.map((result, index) => (
              <motion.div
                key={`${result.translation}-${result.book}-${result.chapter}-${result.verse}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  onResultClick(result.book, result.chapter, result.verse);
                  setShowHistory(false);
                }}
                className="p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all"
                style={{
                  backgroundColor: currentTheme.colors.surface,
                  borderColor: currentTheme.colors.border
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium" style={{ color: currentTheme.colors.primary }}>
                    {result.book} {result.chapter}:{result.verse}
                  </div>
                  <div className="text-xs px-2 py-1 rounded" 
                    style={{ 
                      backgroundColor: result.testament === 'old' ? '#fef3c7' : '#dbeafe',
                      color: result.testament === 'old' ? '#92400e' : '#1e40af'
                    }}
                  >
                    {result.translation}
                  </div>
                </div>
                <div className="text-sm leading-relaxed" style={{ color: currentTheme.colors.text }}>
                  {highlightText(result.text, query)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close history */}
      {showHistory && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowHistory(false)}
        />
      )}
    </div>
  );
};
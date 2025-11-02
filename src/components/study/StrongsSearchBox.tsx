import React, { memo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useStrongsSearch } from '../../hooks/useStrongsSearch';

interface StrongsSearchBoxProps {
  onResultSelect?: (entry: any) => void;
  className?: string;
}

export const StrongsSearchBox = memo<StrongsSearchBoxProps>(({
  onResultSelect,
  className = ''
}) => {
  const { currentTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    searchResults,
    searchQuery,
    setSearchQuery,
    filterLanguage,
    setFilterLanguage,
    isSearching,
    suggestions
  } = useStrongsSearch();

  const handleResultClick = (entry: any) => {
    onResultSelect?.(entry);
    setSearchQuery('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    inputRef.current?.focus();
  };

  const clearSearch = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
          style={{ color: currentTheme.colors.textSecondary }}
        />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Strong's concordance..."
          className="w-full pl-10 pr-20 py-3 rounded-lg border transition-all focus:ring-2"
          style={{
            borderColor: currentTheme.colors.border,
            backgroundColor: currentTheme.colors.surface,
            color: currentTheme.colors.text,
            focusRingColor: currentTheme.colors.primary + '40'
          }}
        />
        
        {/* Filter & Clear */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          <select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value as any)}
            className="text-xs px-2 py-1 rounded border"
            style={{
              borderColor: currentTheme.colors.border,
              backgroundColor: currentTheme.colors.background,
              color: currentTheme.colors.text
            }}
          >
            <option value="all">All</option>
            <option value="hebrew">Hebrew</option>
            <option value="greek">Greek</option>
          </select>
          
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="p-1 rounded hover:opacity-70 transition-opacity"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-lg border shadow-lg z-50 max-h-96 overflow-hidden"
            style={{
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.border
            }}
          >
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-3 border-b" style={{ borderColor: currentTheme.colors.border }}>
                <h4 className="text-xs font-medium mb-2" style={{ color: currentTheme.colors.textSecondary }}>
                  Suggestions
                </h4>
                <div className="flex flex-wrap gap-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-2 py-1 rounded text-xs hover:opacity-80 transition-opacity"
                      style={{
                        backgroundColor: currentTheme.colors.primary + '20',
                        color: currentTheme.colors.primary
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            <div className="max-h-64 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((entry, index) => {
                  const isHebrew = entry.strongs.startsWith('H');
                  return (
                    <motion.div
                      key={entry.strongs}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 border-b cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ borderColor: currentTheme.colors.border }}
                      onClick={() => handleResultClick(entry)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="px-2 py-1 rounded text-xs font-mono"
                          style={{
                            backgroundColor: isHebrew ? '#3b82f6' : '#ef4444',
                            color: 'white'
                          }}
                        >
                          {entry.strongs}
                        </span>
                        <span className="font-medium text-sm" style={{ color: currentTheme.colors.text }}>
                          {entry.transliteration}
                        </span>
                        <span className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                          [{entry.pronunciation}]
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                        {entry.definition}
                      </p>
                    </motion.div>
                  );
                })
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                    No results found for "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

StrongsSearchBox.displayName = 'StrongsSearchBox';
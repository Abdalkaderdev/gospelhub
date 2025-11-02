import React, { useState } from 'react';
import { AdvancedSearchOptions, BookCategory, BOOK_CATEGORIES, SearchResultEnhanced } from '../../types/bible-enhanced';
import { BibleMetadataService } from '../../services/BibleMetadataService';

interface AdvancedSearchPanelProps {
  onSearch: (query: string, options: AdvancedSearchOptions) => void;
  results?: SearchResultEnhanced[];
  isLoading?: boolean;
}

export const AdvancedSearchPanel: React.FC<AdvancedSearchPanelProps> = ({
  onSearch,
  results = [],
  isLoading = false
}) => {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<AdvancedSearchOptions>({
    phrase: false,
    wholeWords: false,
    caseSensitive: false,
    translations: [],
    books: [],
    testament: undefined,
    category: undefined
  });

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, options);
    }
  };

  const handleOptionChange = (key: keyof AdvancedSearchOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayOption = (key: 'translations' | 'books', value: string) => {
    setOptions(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Search Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search Query
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter search terms..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Search Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Basic Options */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Search Options</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.phrase}
                onChange={(e) => handleOptionChange('phrase', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Exact phrase</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.wholeWords}
                onChange={(e) => handleOptionChange('wholeWords', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Whole words only</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.caseSensitive}
                onChange={(e) => handleOptionChange('caseSensitive', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Case sensitive</span>
            </label>
          </div>
        </div>

        {/* Scope Options */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Search Scope</h3>
          <div className="space-y-3">
            {/* Testament Filter */}
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Testament</label>
              <select
                value={options.testament || ''}
                onChange={(e) => handleOptionChange('testament', e.target.value || undefined)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="">All</option>
                <option value="Old">Old Testament</option>
                <option value="New">New Testament</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Category</label>
              <select
                value={options.category || ''}
                onChange={(e) => handleOptionChange('category', e.target.value || undefined)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Categories</option>
                {Object.keys(BOOK_CATEGORIES).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Search Results ({results.length})
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {result.reference.book} {result.reference.chapter}:{result.reference.verse}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                      {result.translation}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                      {Math.round(result.relevanceScore * 100)}% match
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {renderHighlightedText(result.text, result.highlights)}
                </p>
                {result.context && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                    Context: {result.context}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const renderHighlightedText = (text: string, highlights: { start: number; length: number }[]) => {
  if (!highlights.length) return text;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

  for (const highlight of sortedHighlights) {
    // Add text before highlight
    if (highlight.start > lastIndex) {
      parts.push(text.slice(lastIndex, highlight.start));
    }

    // Add highlighted text
    parts.push(
      <mark
        key={highlight.start}
        className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
      >
        {text.slice(highlight.start, highlight.start + highlight.length)}
      </mark>
    );

    lastIndex = highlight.start + highlight.length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
};
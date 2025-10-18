import React, { useState } from 'react';
import { Verse } from '../types';
import { useBookmarks, useBibleNavigation } from '@gospelhub/core';

interface EnhancedBookmarkManagerProps {
  className?: string;
}

export const EnhancedBookmarkManager: React.FC<EnhancedBookmarkManagerProps> = ({
  className = ''
}) => {
  const [selectedBook, setSelectedBook] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'book' | 'chapter'>('date');
  const [showExport, setShowExport] = useState(false);
  const [exportData, setExportData] = useState('');

  const { 
    bookmarkVerses, 
    isLoading, 
    error, 
    bookmarkCount, 
    stats,
    removeBookmark,
    exportBookmarks,
    importBookmarks,
    clearAllBookmarks 
  } = useBookmarks();

  const { goToChapter } = useBibleNavigation();

  // Filter bookmarks by book
  const filteredBookmarks = selectedBook === 'all' 
    ? bookmarkVerses 
    : bookmarkVerses.filter(verse => verse.book === selectedBook);

  // Sort bookmarks
  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    switch (sortBy) {
      case 'book':
        return a.book.localeCompare(b.book) || a.chapter - b.chapter || a.verse - b.verse;
      case 'chapter':
        return a.chapter - b.chapter || a.verse - b.verse;
      case 'date':
      default:
        return 0; // Keep original order for now
    }
  });

  // Handle bookmark removal
  const handleRemoveBookmark = async (verseReference: string) => {
    await removeBookmark(verseReference);
  };

  // Handle navigation to verse
  const handleNavigateToVerse = (verse: Verse) => {
    goToChapter(verse.book, verse.chapter);
  };

  // Handle export
  const handleExport = () => {
    const data = exportBookmarks();
    setExportData(data);
    setShowExport(true);
  };

  // Handle import
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const text = await file.text();
      await importBookmarks(text);
    }
  };

  // Handle clear all
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all bookmarks? This action cannot be undone.')) {
      clearAllBookmarks();
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Bookmarks ({bookmarkCount})
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="px-3 py-1 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Export
          </button>
          <label className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <button
            onClick={handleClearAll}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Book
          </label>
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Books</option>
            {stats.books.map(book => (
              <option key={book} value={book}>{book}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'book' | 'chapter')}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="date">Date Added</option>
            <option value="book">Book</option>
            <option value="chapter">Chapter</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-primary-600">{stats.totalBookmarks}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Bookmarks</div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-primary-600">{stats.totalBooks}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Books</div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-primary-600">{stats.totalChapters}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Chapters</div>
        </div>
      </div>

      {/* Bookmarks List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      ) : sortedBookmarks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            {selectedBook === 'all' ? 'No bookmarks yet.' : `No bookmarks in ${selectedBook}.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sortedBookmarks.map((verse) => (
            <div
              key={verse.reference}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
            >
              <div className="flex-1">
                <button
                  onClick={() => handleNavigateToVerse(verse)}
                  className="text-left w-full"
                >
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {verse.reference}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {verse.text}
                  </p>
                </button>
              </div>
              <button
                onClick={() => handleRemoveBookmark(verse.reference)}
                className="ml-3 p-1 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Remove bookmark"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Export Bookmarks
            </h3>
            <textarea
              value={exportData}
              readOnly
              className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(exportData);
                  alert('Copied to clipboard!');
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setShowExport(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
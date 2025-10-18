import React, { useState } from 'react';
import { Verse } from '../types';
import { VerseCard } from './VerseCard';
import { SearchBar } from './SearchBar';
import { useBible, useBibleNavigation, useSearch, useBookmarks } from '@gospelhub/core';

interface EnhancedBibleReaderProps {
  className?: string;
  onVerseSelect?: (verse: Verse) => void;
}

export const EnhancedBibleReader: React.FC<EnhancedBibleReaderProps> = ({
  className = '',
  onVerseSelect
}) => {
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  // Hooks
  const { verses, chapterData, bookMetadata, isLoading, error } = useBible();
  const { 
    currentBook, 
    currentChapter, 
    canGoNext, 
    canGoPrevious, 
    goToNextChapter, 
    goToPreviousChapter,
    progress,
    locationDisplay 
  } = useBibleNavigation();
  const { 
    query, 
    results, 
    isSearching, 
    handleSearchChange, 
    handleSearchSubmit, 
    clearSearch,
    isActive: isSearchActive,
    resultCount,
    statusMessage 
  } = useSearch();
  const { 
    toggleBookmark, 
    isBookmarked, 
    bookmarkCount 
  } = useBookmarks();

  // Handle search
  const handleSearch = (searchQuery: string) => {
    handleSearchChange(searchQuery);
    setIsSearchMode(searchQuery.trim().length > 0);
  };

  // Handle search submit
  const handleSearchSubmitForm = (searchQuery: string) => {
    handleSearchSubmit(searchQuery);
    setIsSearchMode(searchQuery.trim().length > 0);
  };

  // Handle verse bookmark
  const handleVerseBookmark = async (verse: Verse) => {
    await toggleBookmark(verse);
  };

  // Handle verse selection
  const handleVerseSelect = (verse: Verse) => {
    onVerseSelect?.(verse);
  };

  // Get display verses
  const displayVerses = isSearchMode ? results.map(r => r.verse) : verses;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isSearchMode ? 'Search Results' : locationDisplay}
            </h1>
            {!isSearchMode && bookMetadata && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Chapter {currentChapter} of {bookMetadata.totalChapters}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {!isSearchMode && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={goToPreviousChapter}
                  disabled={!canGoPrevious}
                  className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous chapter"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={goToNextChapter}
                  disabled={!canGoNext}
                  className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next chapter"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
            
            {isSearchMode && (
              <button
                onClick={() => {
                  clearSearch();
                  setIsSearchMode(false);
                }}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Exit Search
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {!isSearchMode && bookMetadata && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <SearchBar 
          onSearch={handleSearch}
          placeholder={isSearchMode ? "Search Bible..." : "Search Bible..."}
        />

        {/* Search status */}
        {isSearchActive && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {statusMessage}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Main Reading Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayVerses.map((verse) => (
                    <div
                      key={verse.reference}
                      onClick={() => handleVerseSelect(verse)}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <VerseCard
                        verse={verse}
                        onBookmark={handleVerseBookmark}
                        isBookmarked={isBookmarked(verse.reference)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {displayVerses.length === 0 && !isLoading && !error && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    {isSearchMode ? 'No verses found matching your search.' : 'No verses available for this chapter.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div>
            {isSearchMode ? (
              <span>{resultCount} results</span>
            ) : (
              <span>{verses.length} verses • {bookmarkCount} bookmarks</span>
            )}
          </div>
          <div>
            {!isSearchMode && chapterData && (
              <span>Genesis {chapterData.chapter}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
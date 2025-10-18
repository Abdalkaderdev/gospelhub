import React, { useState, useEffect } from 'react';
import { Verse } from '../types';
import { SwipeableContainer } from './SwipeableContainer';
import { PullToRefresh } from './PullToRefresh';
import { BottomSheet } from './BottomSheet';
import { LoadingSkeleton, VerseCardSkeleton } from './LoadingSkeleton';
import { VirtualizedList } from './VirtualizedList';
import { VerseCard } from './VerseCard';
import { SearchBar } from './SearchBar';

interface MobileBibleReaderProps {
  verses: Verse[];
  currentBook: string;
  currentChapter: number;
  onBookmark: (verse: Verse) => Promise<void>;
  isBookmarked: (verse: Verse) => boolean;
  onNavigateToChapter: (book: string, chapter: number) => void;
  onSearch: (query: string) => void;
  searchResults?: Verse[];
  isSearching?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const MobileBibleReader: React.FC<MobileBibleReaderProps> = ({
  verses,
  currentBook,
  currentChapter,
  onBookmark,
  isBookmarked,
  onNavigateToChapter,
  onSearch,
  searchResults = [],
  isSearching = false,
  isLoading = false,
  className = ''
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSwipeLeft = () => {
    // Navigate to next chapter
    onNavigateToChapter(currentBook, currentChapter + 1);
  };

  const handleSwipeRight = () => {
    // Navigate to previous chapter
    if (currentChapter > 1) {
      onNavigateToChapter(currentBook, currentChapter - 1);
    }
  };

  const handleRefresh = async () => {
    // Refresh current chapter
    onNavigateToChapter(currentBook, currentChapter);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const displayVerses = isSearching ? searchResults : verses;

  if (isLoading) {
    return (
      <div className={`flex flex-col h-full bg-gray-50 dark:bg-gray-900 ${className}`}>
        {/* Header Skeleton */}
        <div className="bg-white dark:bg-gray-800 shadow-sm p-4">
          <LoadingSkeleton width="w-32" height="h-6" className="mb-2" />
          <LoadingSkeleton width="w-24" height="h-4" />
        </div>
        
        {/* Content Skeleton */}
        <div className="flex-1 p-4 space-y-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <VerseCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {currentBook} {currentChapter}
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              onClick={() => setShowNavigation(true)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentChapter / 50) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <SwipeableContainer
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        className="flex-1"
      >
        <PullToRefresh onRefresh={handleRefresh} className="h-full">
          <VirtualizedList
            items={displayVerses}
            itemHeight={120}
            containerHeight={window.innerHeight - 120}
            renderItem={(verse, index) => (
              <div className="p-4">
                <VerseCard
                  verse={verse}
                  onBookmark={onBookmark}
                  isBookmarked={isBookmarked(verse)}
                  className="mb-4"
                />
              </div>
            )}
          />
        </PullToRefresh>
      </SwipeableContainer>

      {/* Search Bottom Sheet */}
      <BottomSheet
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        title="Search Bible"
        snapPoints={[0.7, 0.9]}
      >
        <div className="p-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search verses..."
            className="mb-4"
          />
          
          {isSearching && searchResults.length === 0 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try searching with different keywords
              </p>
            </div>
          )}
          
          {searchResults.length > 0 && (
            <div className="space-y-4">
              {searchResults.map((verse, index) => (
                <VerseCard
                  key={`${verse.book}-${verse.chapter}-${verse.verse}`}
                  verse={verse}
                  onBookmark={onBookmark}
                  isBookmarked={isBookmarked(verse)}
                />
              ))}
            </div>
          )}
        </div>
      </BottomSheet>

      {/* Navigation Bottom Sheet */}
      <BottomSheet
        isOpen={showNavigation}
        onClose={() => setShowNavigation(false)}
        title="Navigate"
        snapPoints={[0.5, 0.8]}
      >
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Current: {currentBook} {currentChapter}
              </h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    if (currentChapter > 1) {
                      onNavigateToChapter(currentBook, currentChapter - 1);
                      setShowNavigation(false);
                    }
                  }}
                  disabled={currentChapter <= 1}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous Chapter
                </button>
                <button
                  onClick={() => {
                    onNavigateToChapter(currentBook, currentChapter + 1);
                    setShowNavigation(false);
                  }}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg"
                >
                  Next Chapter
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Quick Navigation
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {['Genesis', 'Psalms', 'Matthew', 'John', 'Romans', 'Revelation'].map((book) => (
                  <button
                    key={book}
                    onClick={() => {
                      onNavigateToChapter(book, 1);
                      setShowNavigation(false);
                    }}
                    className="p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-100">{book}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Chapter 1</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Verse, BibleBook, SearchResult } from '../types';
import { VerseCard } from './VerseCard';
import { BibleNavigator } from './BibleNavigator';
import { SearchBar } from './SearchBar';

interface BibleReaderProps {
  className?: string;
  onBookmark?: (verse: Verse) => void;
  bookmarks?: string[];
  onReadingProgress?: (book: string, chapter: number) => void;
}

export const BibleReader: React.FC<BibleReaderProps> = ({
  className = '',
  onBookmark,
  bookmarks = [],
  onReadingProgress
}) => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState('Genesis');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load verses when book/chapter changes
  useEffect(() => {
    if (!isSearchMode) {
      loadChapter(selectedBook, selectedChapter);
    }
  }, [selectedBook, selectedChapter, isSearchMode]);

  const loadChapter = async (book: string, chapter: number) => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from an API
      // For now, we'll use the sample data
      const response = await import('@gospelhub/core');
      const chapterData = response.getChapter(book, chapter);
      if (chapterData) {
        setVerses(chapterData.verses);
        onReadingProgress?.(book, chapter);
      } else {
        setVerses([]);
      }
    } catch (error) {
      console.error('Error loading chapter:', error);
      setVerses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearchMode(true);
      // In a real app, this would use the search service
      // For now, we'll simulate search results
      const response = import('@gospelhub/core');
      response.then(({ BibleSearch, getAllVerses }) => {
        const search = new BibleSearch(getAllVerses());
        const results = search.search(query, { limit: 20 });
        setSearchResults(results);
      });
    } else {
      setIsSearchMode(false);
      setSearchResults([]);
    }
  };

  const handleBookSelect = (book: string) => {
    setSelectedBook(book);
    setSelectedChapter(1);
    setIsSearchMode(false);
  };

  const handleChapterSelect = (book: string, chapter: number) => {
    setSelectedBook(book);
    setSelectedChapter(chapter);
    setIsSearchMode(false);
  };

  const handleVerseBookmark = (verse: Verse) => {
    onBookmark?.(verse);
  };

  const navigateChapter = (direction: 'prev' | 'next') => {
    if (isSearchMode) return;
    
    const response = import('@gospelhub/core');
    response.then(({ BIBLE_BOOKS, getBookByName }) => {
      const currentBook = getBookByName(selectedBook);
      if (!currentBook) return;

      if (direction === 'next') {
        if (selectedChapter < currentBook.chapters) {
          setSelectedChapter(selectedChapter + 1);
        } else {
          // Move to next book
          const nextBook = BIBLE_BOOKS.find(book => book.order === currentBook.order + 1);
          if (nextBook) {
            setSelectedBook(nextBook.name);
            setSelectedChapter(1);
          }
        }
      } else {
        if (selectedChapter > 1) {
          setSelectedChapter(selectedChapter - 1);
        } else {
          // Move to previous book
          const prevBook = BIBLE_BOOKS.find(book => book.order === currentBook.order - 1);
          if (prevBook) {
            setSelectedBook(prevBook.name);
            setSelectedChapter(prevBook.chapters);
          }
        }
      }
    });
  };

  const displayVerses = isSearchMode ? searchResults.map(r => r.verse) : verses;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isSearchMode ? 'Search Results' : `${selectedBook} ${selectedChapter}`}
          </h1>
          <div className="flex items-center space-x-2">
            {!isSearchMode && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => navigateChapter('prev')}
                  className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Previous chapter"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => navigateChapter('next')}
                  className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Next chapter"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Sidebar */}
          <div className="hidden lg:block w-80 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
              <BibleNavigator
                onBookSelect={handleBookSelect}
                onChapterSelect={handleChapterSelect}
                selectedBook={selectedBook}
                selectedChapter={selectedChapter}
              />
            </div>
          </div>

          {/* Main Reading Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayVerses.map((verse) => (
                    <VerseCard
                      key={verse.reference}
                      verse={verse}
                      onBookmark={handleVerseBookmark}
                      isBookmarked={bookmarks.includes(verse.reference)}
                    />
                  ))}
                </div>
              )}

              {displayVerses.length === 0 && !isLoading && (
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

      {/* Mobile Navigation */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <BibleNavigator
          onBookSelect={handleBookSelect}
          onChapterSelect={handleChapterSelect}
          selectedBook={selectedBook}
          selectedChapter={selectedChapter}
        />
      </div>
    </div>
  );
};
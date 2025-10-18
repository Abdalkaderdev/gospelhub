import React, { useState, useEffect } from 'react';
import { Verse, SearchResult } from '../types';
import { VerseCard } from './VerseCard';
import { SearchBar } from './SearchBar';

interface MobileBibleReaderProps {
  onBookmark?: (verse: Verse) => void;
  bookmarks?: string[];
  onReadingProgress?: (book: string, chapter: number) => void;
}

export const MobileBibleReader: React.FC<MobileBibleReaderProps> = ({
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

  const handleBookmark = (verse: Verse) => {
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
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {isSearchMode ? 'Search Results' : `${selectedBook} ${selectedChapter}`}
          </h1>
          {!isSearchMode && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateChapter('prev')}
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                ‹
              </button>
              <button
                onClick={() => navigateChapter('next')}
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                ›
              </button>
            </div>
          )}
        </div>
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
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
                  onBookmark={handleBookmark}
                  isBookmarked={bookmarks.includes(verse.reference)}
                />
              ))}
            </div>
          )}

          {displayVerses.length === 0 && !isLoading && (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {isSearchMode ? 'No verses found matching your search.' : 'No verses available for this chapter.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
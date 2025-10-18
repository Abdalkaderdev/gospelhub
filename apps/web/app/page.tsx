'use client';

import { useState, useEffect } from 'react';
import { Layout, VerseCard, BibleNavigator, SearchBar, Verse, SearchResult } from '@gospelhub/ui';
import { BibleSearch, getAllVerses, getChapter } from '@gospelhub/core';

export default function HomePage() {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState('Genesis');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [bibleSearch] = useState(() => new BibleSearch(getAllVerses()));

  // Load initial chapter
  useEffect(() => {
    const chapter = getChapter(selectedBook, selectedChapter);
    if (chapter) {
      setVerses(chapter.verses);
    }
  }, [selectedBook, selectedChapter]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = bibleSearch.search(searchQuery, { limit: 20 });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, bibleSearch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleBookSelect = (book: string) => {
    setSelectedBook(book);
    setSelectedChapter(1);
  };

  const handleChapterSelect = (book: string, chapter: number) => {
    setSelectedBook(book);
    setSelectedChapter(chapter);
  };

  const handleBookmark = (verse: Verse) => {
    // TODO: Implement bookmark functionality
    console.log('Bookmark verse:', verse.reference);
  };

  const displayVerses = searchQuery.trim() ? searchResults.map(r => r.verse) : verses;

  return (
    <Layout theme={theme} onThemeChange={setTheme}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <SearchBar onSearch={handleSearch} />
            <BibleNavigator
              onBookSelect={handleBookSelect}
              onChapterSelect={handleChapterSelect}
              selectedBook={selectedBook}
              selectedChapter={selectedChapter}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {searchQuery.trim() ? `Search Results for "${searchQuery}"` : `${selectedBook} ${selectedChapter}`}
            </h2>
            {searchQuery.trim() && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {searchResults.length} results found
              </p>
            )}
          </div>

          <div className="space-y-4">
            {displayVerses.map((verse) => (
              <VerseCard
                key={verse.reference}
                verse={verse}
                onBookmark={handleBookmark}
                isBookmarked={false} // TODO: Implement bookmark state
              />
            ))}
          </div>

          {displayVerses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery.trim() ? 'No verses found matching your search.' : 'No verses available for this chapter.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
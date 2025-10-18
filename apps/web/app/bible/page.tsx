'use client';

import { useState, useEffect } from 'react';
import { Layout, BibleReader, BookmarkManager, ReadingProgressComponent as ReadingProgress, Verse } from '@gospelhub/ui';
import { WebStorageAdapter, StorageManager, BookmarkManager as CoreBookmarkManager } from '@gospelhub/core';

export default function BiblePage() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [currentBook, setCurrentBook] = useState('Genesis');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [totalChapters, setTotalChapters] = useState(50);
  const [bookmarkManager, setBookmarkManager] = useState<CoreBookmarkManager | null>(null);
  // const [readingProgressManager, setReadingProgressManager] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'reader' | 'bookmarks' | 'progress'>('reader');

  // Initialize storage and managers
  useEffect(() => {
    const storage = new StorageManager(new WebStorageAdapter());
    const bookmarkMgr = new CoreBookmarkManager(storage);
    setBookmarkManager(bookmarkMgr);
    
    // Load existing bookmarks
    bookmarkMgr.getBookmarkReferences().then(setBookmarks);
    
    // Load current reading position
    // progressMgr.getCurrentPosition().then(position => {
    //   if (position) {
    //     setCurrentBook(position.book);
    //     setCurrentChapter(position.chapter);
    //   }
    // });
  }, []);

  // Load total chapters for current book
  useEffect(() => {
    const loadTotalChapters = async () => {
      const { getBookByName } = await import('@gospelhub/core');
      const book = getBookByName(currentBook);
      if (book) {
        setTotalChapters(book.chapters);
      }
    };
    loadTotalChapters();
  }, [currentBook]);

  const handleBookmark = async (verse: Verse) => {
    if (!bookmarkManager) return;
    
    try {
      const isBookmarked = await bookmarkManager.isBookmarked(verse.reference);
      
      if (isBookmarked) {
        await bookmarkManager.removeBookmark(verse.reference);
        setBookmarks(prev => prev.filter(ref => ref !== verse.reference));
      } else {
        await bookmarkManager.addBookmark(verse);
        setBookmarks(prev => [...prev, verse.reference]);
      }
    } catch (error) {
      console.error('Error managing bookmark:', error);
    }
  };

  const handleReadingProgress = async (book: string, chapter: number) => {
    setCurrentBook(book);
    setCurrentChapter(chapter);
    
    // if (readingProgressManager) {
    //   await readingProgressManager.updateProgress(book, chapter);
    // }
  };

  const handleRemoveBookmark = async (verseReference: string) => {
    if (!bookmarkManager) return;
    
    try {
      await bookmarkManager.removeBookmark(verseReference);
      setBookmarks(prev => prev.filter(ref => ref !== verseReference));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const handleNavigateToVerse = (book: string, chapter: number) => {
    setCurrentBook(book);
    setCurrentChapter(chapter);
    setActiveTab('reader');
  };

  return (
    <Layout theme={theme} onThemeChange={setTheme}>
      <div className="h-screen flex">
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6">
              <button
                onClick={() => setActiveTab('reader')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'reader'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Reader
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'bookmarks'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Bookmarks
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'progress'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Progress
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'reader' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {currentBook} {currentChapter}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Chapter {currentChapter} of {totalChapters}
                  </p>
                </div>
                
                <ReadingProgress
                  book={currentBook}
                  chapter={currentChapter}
                  totalChapters={totalChapters}
                />
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <BookmarkManager
                bookmarks={bookmarks}
                onRemoveBookmark={handleRemoveBookmark}
                onNavigateToVerse={handleNavigateToVerse}
              />
            )}

            {activeTab === 'progress' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Reading Statistics
                </h3>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">
                      {bookmarks.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Bookmarks Saved
                    </p>
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">
                      {currentBook}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Current Book
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <BibleReader
            onBookmark={handleBookmark}
            bookmarks={bookmarks}
            onReadingProgress={handleReadingProgress}
            className="h-full"
          />
        </div>
      </div>
    </Layout>
  );
}
'use client';

import { useState } from 'react';
import { Layout, EnhancedBibleReader, EnhancedBookmarkManager, ReadingProgressComponent as ReadingProgress } from '@gospelhub/ui';
import { useBible, useBibleNavigation, useBookmarks } from '@gospelhub/core';

export default function EnhancedBiblePage() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [activeTab, setActiveTab] = useState<'reader' | 'bookmarks' | 'progress'>('reader');
  const [selectedVerse, setSelectedVerse] = useState<string | null>(null);

  // Hooks
  const { bookMetadata } = useBible();
  const { currentBook, currentChapter, progress } = useBibleNavigation();
  const { bookmarkCount, stats } = useBookmarks();

  const handleVerseSelect = (verse: { reference: string }) => {
    setSelectedVerse(verse.reference);
    // In a real app, you might show a modal or navigate to a verse detail page
    console.log('Selected verse:', verse);
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
                  {bookMetadata && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Chapter {currentChapter} of {bookMetadata.totalChapters}
                    </p>
                  )}
                </div>
                
                {bookMetadata && (
                  <ReadingProgress
                    book={currentBook}
                    chapter={currentChapter}
                    totalChapters={bookMetadata.totalChapters}
                  />
                )}

                {selectedVerse && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Selected: {selectedVerse}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <EnhancedBookmarkManager />
            )}

            {activeTab === 'progress' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Reading Statistics
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {bookmarkCount}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Bookmarks
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {Math.round(progress)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Progress
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Book Statistics
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Books with bookmarks:</span>
                      <span className="font-medium">{stats.totalBooks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Chapters with bookmarks:</span>
                      <span className="font-medium">{stats.totalChapters}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total bookmarks:</span>
                      <span className="font-medium">{stats.totalBookmarks}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Current Location
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentBook} {currentChapter}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <EnhancedBibleReader
            onVerseSelect={handleVerseSelect}
            className="h-full"
          />
        </div>
      </div>
    </Layout>
  );
}
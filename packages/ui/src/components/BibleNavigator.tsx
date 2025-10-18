import React, { useState } from 'react';
import { BibleNavigatorProps } from '../types';
import { BIBLE_BOOKS, getBooksByTestament } from '@gospelhub/core';

export const BibleNavigator: React.FC<BibleNavigatorProps> = ({
  onBookSelect,
  onChapterSelect,
  selectedBook,
  selectedChapter,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'old' | 'new'>('old');
  const [selectedBookState, setSelectedBookState] = useState<string | undefined>(selectedBook);

  const oldTestamentBooks = getBooksByTestament('old');
  const newTestamentBooks = getBooksByTestament('new');

  const handleBookClick = (bookName: string) => {
    setSelectedBookState(bookName);
    onBookSelect(bookName);
  };

  const handleChapterClick = (chapter: number) => {
    if (selectedBookState) {
      onChapterSelect(selectedBookState, chapter);
    }
  };

  const renderChapterGrid = (bookName: string, totalChapters: number) => {
    const chapters = Array.from({ length: totalChapters }, (_, i) => i + 1);
    
    return (
      <div className="grid grid-cols-6 gap-2 mt-4">
        {chapters.map((chapter) => (
          <button
            key={chapter}
            onClick={() => handleChapterClick(chapter)}
            className={`p-2 text-sm rounded-md transition-colors ${
              selectedBookState === bookName && selectedChapter === chapter
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900'
            }`}
          >
            {chapter}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex space-x-1 mb-4">
        <button
          onClick={() => setActiveTab('old')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'old'
              ? 'bg-primary-600 text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Old Testament
        </button>
        <button
          onClick={() => setActiveTab('new')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'new'
              ? 'bg-primary-600 text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          New Testament
        </button>
      </div>

      <div className="space-y-2">
        {(activeTab === 'old' ? oldTestamentBooks : newTestamentBooks).map((book) => (
          <div key={book.name}>
            <button
              onClick={() => handleBookClick(book.name)}
              className={`w-full text-left p-3 rounded-md transition-colors ${
                selectedBookState === book.name
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{book.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {book.chapters} chapters
                </span>
              </div>
            </button>
            
            {selectedBookState === book.name && renderChapterGrid(book.name, book.chapters)}
          </div>
        ))}
      </div>
    </div>
  );
};
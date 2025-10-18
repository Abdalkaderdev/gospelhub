import React, { useState, useEffect } from 'react';
import { Verse } from '../types';

interface BookmarkManagerProps {
  bookmarks: string[];
  onRemoveBookmark: (verseReference: string) => void;
  onNavigateToVerse: (book: string, chapter: number) => void;
  className?: string;
}

export const BookmarkManager: React.FC<BookmarkManagerProps> = ({
  bookmarks,
  onRemoveBookmark,
  onNavigateToVerse,
  className = ''
}) => {
  const [bookmarkVerses, setBookmarkVerses] = useState<Verse[]>([]);

  useEffect(() => {
    // In a real app, you'd fetch the actual verse objects
    // For now, we'll create mock verses from the references
    const verses = bookmarks.map(ref => {
      const [book, chapterVerse] = ref.split(' ');
      const [chapter, verse] = chapterVerse.split(':');
      return {
        book,
        chapter: parseInt(chapter),
        verse: parseInt(verse),
        text: `Bookmarked verse from ${ref}`,
        reference: ref
      };
    });
    setBookmarkVerses(verses);
  }, [bookmarks]);

  const handleRemoveBookmark = (verseReference: string) => {
    onRemoveBookmark(verseReference);
  };

  const handleNavigateToVerse = (verse: Verse) => {
    onNavigateToVerse(verse.book, verse.chapter);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Bookmarks ({bookmarks.length})
      </h3>
      
      {bookmarkVerses.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No bookmarks yet. Tap the bookmark icon on any verse to save it.
        </p>
      ) : (
        <div className="space-y-3">
          {bookmarkVerses.map((verse) => (
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
    </div>
  );
};
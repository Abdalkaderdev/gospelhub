import React, { memo, useMemo, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { BibleVerse } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { VirtualizedVerseList } from './VirtualizedVerseList';

interface OptimizedBibleReaderProps {
  verses: BibleVerse[];
  currentBook: string;
  currentChapter: number;
  onVerseClick?: (verse: BibleVerse) => void;
  onBookChange?: (book: string) => void;
  onChapterChange?: (chapter: number) => void;
  availableBooks?: string[];
  availableChapters?: number[];
}

const BookSelector = memo<{
  books: string[];
  currentBook: string;
  onBookChange: (book: string) => void;
}>(({ books, currentBook, onBookChange }) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onBookChange(e.target.value);
  }, [onBookChange]);

  return (
    <select
      value={currentBook}
      onChange={handleChange}
      className="px-4 py-2 rounded-lg border border-stone-200 bg-white text-stone-900"
    >
      {books.map(book => (
        <option key={book} value={book}>{book}</option>
      ))}
    </select>
  );
});

BookSelector.displayName = 'BookSelector';

const ChapterSelector = memo<{
  chapters: number[];
  currentChapter: number;
  onChapterChange: (chapter: number) => void;
}>(({ chapters, currentChapter, onChapterChange }) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onChapterChange(Number(e.target.value));
  }, [onChapterChange]);

  return (
    <select
      value={currentChapter}
      onChange={handleChange}
      className="px-4 py-2 rounded-lg border border-stone-200 bg-white text-stone-900"
    >
      {chapters.map(chapter => (
        <option key={chapter} value={chapter}>{chapter}</option>
      ))}
    </select>
  );
});

ChapterSelector.displayName = 'ChapterSelector';

export const OptimizedBibleReader = memo<OptimizedBibleReaderProps>(({
  verses,
  currentBook,
  currentChapter,
  onVerseClick,
  onBookChange,
  onChapterChange,
  availableBooks = [],
  availableChapters = []
}) => {
  const { currentTheme } = useTheme();
  const [containerHeight] = useState(600);

  const headerContent = useMemo(() => (
    <div className="flex items-center justify-between mb-6">
      <h2 
        className="text-2xl font-light"
        style={{ color: currentTheme.colors.text }}
      >
        {currentBook} {currentChapter}
      </h2>
      <div className="flex gap-3">
        {availableBooks.length > 0 && onBookChange && (
          <BookSelector
            books={availableBooks}
            currentBook={currentBook}
            onBookChange={onBookChange}
          />
        )}
        {availableChapters.length > 0 && onChapterChange && (
          <ChapterSelector
            chapters={availableChapters}
            currentChapter={currentChapter}
            onChapterChange={onChapterChange}
          />
        )}
      </div>
    </div>
  ), [currentBook, currentChapter, currentTheme.colors.text, availableBooks, availableChapters, onBookChange, onChapterChange]);

  const handleVerseClick = useCallback((verse: BibleVerse) => {
    onVerseClick?.(verse);
  }, [onVerseClick]);

  const verseCount = useMemo(() => verses.length, [verses.length]);

  return (
    <motion.div
      className="rounded-2xl border p-6 shadow-lg backdrop-blur-sm"
      style={{
        borderColor: currentTheme.colors.border,
        backgroundColor: currentTheme.colors.surface + 'CC'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {headerContent}
      
      {verseCount > 0 ? (
        <VirtualizedVerseList
          verses={verses}
          onVerseClick={handleVerseClick}
          height={containerHeight}
          itemHeight={80}
        />
      ) : (
        <div className="flex items-center justify-center py-8">
          <p style={{ color: currentTheme.colors.textSecondary }}>
            No verses available
          </p>
        </div>
      )}
    </motion.div>
  );
});

OptimizedBibleReader.displayName = 'OptimizedBibleReader';
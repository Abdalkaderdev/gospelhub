import React, { useState, useEffect } from 'react';

interface ReadingProgressProps {
  book: string;
  chapter: number;
  totalChapters: number;
  className?: string;
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({
  book,
  chapter,
  totalChapters,
  className = ''
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const bookProgress = (chapter / totalChapters) * 100;
    setProgress(Math.min(bookProgress, 100));
  }, [chapter, totalChapters]);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Reading Progress
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="mb-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {book} - Chapter {chapter} of {totalChapters}
        </p>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="mt-3 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Start</span>
        <span>Complete</span>
      </div>
    </div>
  );
};
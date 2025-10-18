import React from 'react';
import { VerseCardProps } from '../types';

export const VerseCard: React.FC<VerseCardProps> = ({
  verse,
  onBookmark,
  isBookmarked = false,
  className = ''
}) => {
  const handleBookmark = () => {
    onBookmark?.(verse);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {verse.reference}
        </h3>
        <button
          onClick={handleBookmark}
          className={`p-1 rounded-full transition-colors ${
            isBookmarked
              ? 'text-yellow-500 hover:text-yellow-600'
              : 'text-gray-400 hover:text-yellow-500'
          }`}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <svg
            className="w-5 h-5"
            fill={isBookmarked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      </div>
      <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
        {verse.text}
      </p>
    </div>
  );
};
import React from 'react';
import { DictionaryEntry } from '../types';

interface DictionaryEntryCardProps {
  entry: DictionaryEntry;
  onToggleFavorite: (entry: DictionaryEntry) => void;
  onNavigateToVerse: (book: string, chapter: number, verse: number) => void;
  className?: string;
}

export const DictionaryEntryCard: React.FC<DictionaryEntryCardProps> = ({
  entry,
  onToggleFavorite,
  onNavigateToVerse,
  className = ''
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'theology':
        return 'bg-blue-100 text-blue-800';
      case 'person':
        return 'bg-green-100 text-green-800';
      case 'place':
        return 'bg-purple-100 text-purple-800';
      case 'concept':
        return 'bg-orange-100 text-orange-800';
      case 'event':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'theology':
        return '📚';
      case 'person':
        return '👤';
      case 'place':
        return '📍';
      case 'concept':
        return '💡';
      case 'event':
        return '📅';
      default:
        return '📖';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{getCategoryIcon(entry.category)}</span>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {entry.term}
            </h3>
            {entry.pronunciation && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                /{entry.pronunciation}/
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(entry.category)}`}>
            {entry.category}
          </span>
          <button
            onClick={() => onToggleFavorite(entry)}
            className={`p-2 rounded-full transition-colors ${
              entry.isFavorite
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-400 hover:text-red-500'
            }`}
            aria-label={entry.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg className="w-5 h-5" fill={entry.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Definition */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Definition
        </h4>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {entry.definition}
        </p>
      </div>

      {/* Etymology */}
      {entry.etymology && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Etymology
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            {entry.etymology}
          </p>
        </div>
      )}

      {/* Related Terms */}
      {entry.relatedTerms.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Related Terms
          </h4>
          <div className="flex flex-wrap gap-2">
            {entry.relatedTerms.map((term, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bible Verses */}
      {entry.verses.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Bible Verses
          </h4>
          <div className="space-y-3">
            {entry.verses.map((verse, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => onNavigateToVerse(verse.book, verse.chapter, verse.verse)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      {verse.reference}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-2">
                      "{verse.text}"
                    </p>
                    {verse.context && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {verse.context}
                      </p>
                    )}
                  </div>
                  <svg className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practical Application */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Practical Application
        </h4>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {entry.practicalApplication}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <span>Search count: {entry.searchCount}</span>
          {entry.isFavorite && (
            <span className="flex items-center space-x-1 text-red-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Favorite</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
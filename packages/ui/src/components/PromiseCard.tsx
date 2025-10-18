import React from 'react';
import { GodsPromise } from '../types';

interface PromiseCardProps {
  promise: GodsPromise;
  onClaim: (promise: GodsPromise) => void;
  onToggleFavorite: (promise: GodsPromise) => void;
  className?: string;
}

export const PromiseCard: React.FC<PromiseCardProps> = ({
  promise,
  onClaim,
  onToggleFavorite,
  className = ''
}) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      healing: 'bg-green-100 text-green-800 border-green-200',
      provision: 'bg-blue-100 text-blue-800 border-blue-200',
      peace: 'bg-purple-100 text-purple-800 border-purple-200',
      strength: 'bg-orange-100 text-orange-800 border-orange-200',
      guidance: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      protection: 'bg-red-100 text-red-800 border-red-200',
      love: 'bg-pink-100 text-pink-800 border-pink-200',
      hope: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      healing: '🏥',
      provision: '💰',
      peace: '🕊️',
      strength: '💪',
      guidance: '🧭',
      protection: '🛡️',
      love: '❤️',
      hope: '🌟'
    };
    return icons[category] || '✨';
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 ${getCategoryColor(promise.category)} ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getCategoryIcon(promise.category)}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {promise.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {promise.category}
            </p>
          </div>
        </div>
        <button
          onClick={() => onToggleFavorite(promise)}
          className={`p-2 rounded-full transition-colors ${
            promise.isFavorite
              ? 'text-red-500 hover:text-red-600'
              : 'text-gray-400 hover:text-red-500'
          }`}
          aria-label={promise.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg className="w-5 h-5" fill={promise.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {promise.description}
      </p>

      {/* Verses */}
      <div className="mb-4">
        {promise.verses.map((verse, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 mb-2">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              {verse.reference}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 italic">
              "{verse.text}"
            </p>
          </div>
        ))}
      </div>

      {/* Application */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          How to Apply This Promise:
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {promise.application}
        </p>
      </div>

      {/* Prayer */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          Prayer:
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 italic">
          "{promise.prayer}"
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {promise.isClaimed && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ Claimed
            </span>
          )}
          {promise.claimedDate && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(promise.claimedDate).toLocaleDateString()}
            </span>
          )}
        </div>
        
        <button
          onClick={() => onClaim(promise)}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            promise.isClaimed
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {promise.isClaimed ? 'Claimed' : 'Claim This Promise'}
        </button>
      </div>
    </div>
  );
};
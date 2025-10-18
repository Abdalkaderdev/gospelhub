import React from 'react';
import { BagItem, PrayerRequest, Reflection, SpiritualNote, AnswerToPrayer } from '../types';

interface BagItemCardProps {
  item: BagItem;
  onEdit: (item: BagItem) => void;
  onDelete: (item: BagItem) => void;
  onToggleFavorite: (item: BagItem) => void;
  className?: string;
}

export const BagItemCard: React.FC<BagItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleFavorite,
  className = ''
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prayer':
        return '🙏';
      case 'reflection':
        return '💭';
      case 'note':
        return '📝';
      case 'answer':
        return '✨';
      default:
        return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prayer':
        return 'border-l-blue-500';
      case 'reflection':
        return 'border-l-purple-500';
      case 'note':
        return 'border-l-green-500';
      case 'answer':
        return 'border-l-yellow-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const getPrayerStatusColor = (status: string) => {
    switch (status) {
      case 'praying':
        return 'bg-blue-100 text-blue-800';
      case 'answered':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMoodIcon = (mood?: string) => {
    switch (mood) {
      case 'grateful':
        return '😊';
      case 'struggling':
        return '😔';
      case 'hopeful':
        return '🌟';
      case 'peaceful':
        return '😌';
      case 'seeking':
        return '🔍';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 ${getTypeColor(item.type)} ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getTypeIcon(item.type)}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {item.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {item.type}
              </span>
              {item.type === 'prayer' && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPrayerStatusColor((item as PrayerRequest).status)}`}>
                  {(item as PrayerRequest).status}
                </span>
              )}
              {item.type === 'reflection' && (item as Reflection).mood && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {getMoodIcon((item as Reflection).mood)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleFavorite(item)}
            className={`p-2 rounded-full transition-colors ${
              item.isFavorite
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-400 hover:text-red-500'
            }`}
            aria-label={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg className="w-4 h-4" fill={item.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
            aria-label="Edit item"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={() => onDelete(item)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete item"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
          {item.content}
        </p>
      </div>

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Special content for different types */}
      {item.type === 'prayer' && (item as PrayerRequest).answer && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
          <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
            Answer to Prayer:
          </h4>
          <p className="text-sm text-green-700 dark:text-green-300">
            {(item as PrayerRequest).answer}
          </p>
        </div>
      )}

      {item.type === 'answer' && (item as AnswerToPrayer).testimony && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
            Testimony:
          </h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            {(item as AnswerToPrayer).testimony}
          </p>
        </div>
      )}

      {/* Related verses */}
      {item.type === 'note' && (item as SpiritualNote).relatedVerses && (item as SpiritualNote).relatedVerses!.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Related Verses:
          </h4>
          <div className="flex flex-wrap gap-2">
            {(item as SpiritualNote).relatedVerses!.map((verse, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded"
              >
                {verse}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>{formatDate(item.createdAt)}</span>
        <div className="flex items-center space-x-4">
          {item.isPrivate && (
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Private</span>
            </span>
          )}
          {item.isFavorite && (
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
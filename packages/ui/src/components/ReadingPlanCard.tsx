import React from 'react';
import { ReadingPlan } from '../types';

interface ReadingPlanCardProps {
  plan: ReadingPlan;
  onSelect: (plan: ReadingPlan) => void;
  className?: string;
}

export const ReadingPlanCard: React.FC<ReadingPlanCardProps> = ({
  plan,
  onSelect,
  className = ''
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bible-in-year':
        return '📖';
      case 'new-testament':
        return '✝️';
      case 'psalms-proverbs':
        return '💡';
      default:
        return '📚';
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow ${className}`}
      onClick={() => onSelect(plan)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{getCategoryIcon(plan.category)}</span>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {plan.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {plan.duration} days
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(plan.difficulty)}`}>
          {plan.difficulty}
        </span>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
        {plan.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span>📅 {plan.totalDays} days</span>
          <span>📖 {plan.dailyReadings.length} readings</span>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
          Start Plan
        </button>
      </div>
    </div>
  );
};
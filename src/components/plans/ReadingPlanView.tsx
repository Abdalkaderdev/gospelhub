import React, { useState } from 'react';
import { ReadingPlan, ReadingPlanDay } from '../../types/bible-enhanced';
import { ReadingPlanService } from '../../services/ReadingPlanService';

interface ReadingPlanViewProps {
  plan?: ReadingPlan;
  completedDays?: number[];
  onDayComplete?: (day: number) => void;
  onPlanSelect?: (plan: ReadingPlan) => void;
}

export const ReadingPlanView: React.FC<ReadingPlanViewProps> = ({
  plan,
  completedDays = [],
  onDayComplete,
  onPlanSelect
}) => {
  const [selectedPlan, setSelectedPlan] = useState<ReadingPlan | null>(plan || null);
  const [showPlanSelector, setShowPlanSelector] = useState(!plan);

  const popularPlans = ReadingPlanService.getPopularPlans();

  const handlePlanSelect = (newPlan: ReadingPlan) => {
    setSelectedPlan(newPlan);
    setShowPlanSelector(false);
    onPlanSelect?.(newPlan);
  };

  const handleDayToggle = (day: number) => {
    onDayComplete?.(day);
  };

  const getProgress = () => {
    if (!selectedPlan) return null;
    return ReadingPlanService.getReadingProgress(selectedPlan, completedDays);
  };

  const progress = getProgress();

  if (showPlanSelector || !selectedPlan) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Choose a Reading Plan
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularPlans.map((planOption) => (
            <div
              key={planOption.id}
              onClick={() => handlePlanSelect(planOption)}
              className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {planOption.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {planOption.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{planOption.duration} days</span>
                <span className="capitalize">{planOption.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Plan Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {selectedPlan.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {selectedPlan.description}
          </p>
        </div>
        <button
          onClick={() => setShowPlanSelector(true)}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Change Plan
        </button>
      </div>

      {/* Progress Overview */}
      {progress && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-blue-800 dark:text-blue-200">Progress</h3>
            <span className="text-sm text-blue-600 dark:text-blue-300">
              {Math.round(progress.percentage)}% Complete
            </span>
          </div>
          
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mb-3">
            <div
              className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-blue-800 dark:text-blue-200">
                {progress.daysCompleted}
              </div>
              <div className="text-blue-600 dark:text-blue-300">Days Done</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-800 dark:text-blue-200">
                {progress.currentDay}
              </div>
              <div className="text-blue-600 dark:text-blue-300">Current Day</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-800 dark:text-blue-200">
                {progress.daysRemaining}
              </div>
              <div className="text-blue-600 dark:text-blue-300">Days Left</div>
            </div>
          </div>
        </div>
      )}

      {/* Current Reading */}
      {progress?.nextReading && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 className="font-medium text-green-800 dark:text-green-200 mb-3">
            Today's Reading (Day {progress.nextReading.day})
          </h3>
          <div className="space-y-2">
            {progress.nextReading.readings.map((reading, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded"
              >
                <span className="text-gray-900 dark:text-white">
                  {reading.book} {reading.chapter}
                  {reading.verses && `:${reading.verses.join(', ')}`}
                </span>
                <button
                  onClick={() => handleDayToggle(progress.nextReading!.day)}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Mark Complete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reading Schedule */}
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">Reading Schedule</h3>
        <div className="max-h-96 overflow-y-auto space-y-2">
          {selectedPlan.readings.map((reading) => {
            const isCompleted = completedDays.includes(reading.day);
            const isCurrent = progress?.currentDay === reading.day;
            
            return (
              <div
                key={reading.day}
                className={`p-3 rounded-lg border transition-colors ${
                  isCompleted
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                    : isCurrent
                    ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                    : 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-medium ${
                    isCompleted
                      ? 'text-green-800 dark:text-green-200'
                      : isCurrent
                      ? 'text-blue-800 dark:text-blue-200'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    Day {reading.day}
                  </h4>
                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded">
                        ✓ Complete
                      </span>
                    )}
                    {isCurrent && !isCompleted && (
                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                        Current
                      </span>
                    )}
                    <button
                      onClick={() => handleDayToggle(reading.day)}
                      className={`text-xs px-2 py-1 rounded ${
                        isCompleted
                          ? 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isCompleted ? 'Undo' : 'Complete'}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {reading.readings.map((r, index) => (
                    <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      {r.book} {r.chapter}{r.verses && `:${r.verses.join(', ')}`}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
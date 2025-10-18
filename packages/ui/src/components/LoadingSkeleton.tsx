import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
  width?: string;
  rounded?: boolean;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  lines = 1,
  height = 'h-4',
  width = 'w-full',
  rounded = true
}) => {
  if (lines === 1) {
    return (
      <div
        className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${height} ${width} ${
          rounded ? 'rounded' : ''
        } ${className}`}
      />
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${height} ${width} ${
            rounded ? 'rounded' : ''
          }`}
        />
      ))}
    </div>
  );
};

// Specific skeleton components for common use cases
export const VerseCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
    <div className="flex items-start space-x-3">
      <LoadingSkeleton width="w-8" height="h-8" className="rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <LoadingSkeleton width="w-16" height="h-4" />
        <LoadingSkeleton lines={3} height="h-4" />
        <div className="flex space-x-2">
          <LoadingSkeleton width="w-20" height="h-6" className="rounded-full" />
          <LoadingSkeleton width="w-16" height="h-6" className="rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

export const ReadingPlanCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <LoadingSkeleton width="w-12" height="h-12" className="rounded" />
        <div className="space-y-2">
          <LoadingSkeleton width="w-32" height="h-6" />
          <LoadingSkeleton width="w-20" height="h-4" />
        </div>
      </div>
      <LoadingSkeleton width="w-16" height="h-6" className="rounded-full" />
    </div>
    <LoadingSkeleton lines={3} height="h-4" className="mb-4" />
    <div className="flex items-center justify-between">
      <div className="flex space-x-4">
        <LoadingSkeleton width="w-16" height="h-4" />
        <LoadingSkeleton width="w-20" height="h-4" />
      </div>
      <LoadingSkeleton width="w-24" height="h-8" className="rounded-md" />
    </div>
  </div>
);

export const PromiseCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-gray-200 ${className}`}>
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <LoadingSkeleton width="w-8" height="h-8" className="rounded" />
        <div className="space-y-1">
          <LoadingSkeleton width="w-40" height="h-5" />
          <LoadingSkeleton width="w-20" height="h-4" />
        </div>
      </div>
      <LoadingSkeleton width="w-8" height="h-8" className="rounded-full" />
    </div>
    <LoadingSkeleton lines={2} height="h-4" className="mb-4" />
    <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 mb-4">
      <LoadingSkeleton width="w-24" height="h-4" className="mb-2" />
      <LoadingSkeleton lines={2} height="h-4" />
    </div>
    <LoadingSkeleton lines={2} height="h-4" className="mb-6" />
    <div className="flex items-center justify-between">
      <div className="flex space-x-2">
        <LoadingSkeleton width="w-16" height="h-6" className="rounded-full" />
        <LoadingSkeleton width="w-20" height="h-4" />
      </div>
      <LoadingSkeleton width="w-32" height="h-8" className="rounded-md" />
    </div>
  </div>
);
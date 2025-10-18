'use client';

import { useState, useEffect } from 'react';
import { PWALayout } from '@gospelhub/ui';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Check initial status
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (isOnline) {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <PWALayout theme="system" onThemeChange={() => {}}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              You&apos;re Offline
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              It looks like you&apos;re not connected to the internet. Don&apos;t worry, you can still access your saved content and continue reading offline.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleRetry}
              disabled={!isOnline}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                isOnline
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isOnline ? 'Try Again' : 'No Internet Connection'}
            </button>
            
            <button
              onClick={handleGoHome}
              className="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Go to Home
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Offline Features Available:
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Read previously loaded Bible chapters</li>
              <li>• View your bookmarks and notes</li>
              <li>• Access your reading plans</li>
              <li>• Browse God&apos;s promises</li>
              <li>• Use the Bible dictionary</li>
            </ul>
          </div>

          <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
            <p>Gospel Hub works offline after your first visit</p>
          </div>
        </div>
      </div>
    </PWALayout>
  );
}
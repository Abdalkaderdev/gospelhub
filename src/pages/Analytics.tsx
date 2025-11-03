import { useState, useEffect } from 'react';
import { MainLayout } from './layouts';

interface ReadingStats {
  totalSessions: number;
  totalTime: number;
  chaptersRead: number;
  streakDays: number;
  favoriteBook: string;
}

export const Analytics = () => {
  const [stats, setStats] = useState<ReadingStats>({
    totalSessions: 0,
    totalTime: 0,
    chaptersRead: 0,
    streakDays: 0,
    favoriteBook: 'None'
  });

  useEffect(() => {
    const saved = localStorage.getItem('gospel-stats');
    if (saved) setStats(JSON.parse(saved));
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <MainLayout title="Analytics">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Reading Analytics</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">{stats.totalSessions}</div>
            <div className="text-gray-600">Reading Sessions</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{formatTime(stats.totalTime)}</div>
            <div className="text-gray-600">Total Reading Time</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.chaptersRead}</div>
            <div className="text-gray-600">Chapters Read</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.streakDays}</div>
            <div className="text-gray-600">Day Streak</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-xl font-bold text-orange-600 mb-2">{stats.favoriteBook}</div>
            <div className="text-gray-600">Favorite Book</div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Weekly Progress</h2>
          <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Chart visualization coming soon</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
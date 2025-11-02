import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyticsManager } from '../analytics';
import { ReadingStats } from '../types';
import { ReadingChart } from './charts/ReadingChart';
import { ProgressRing } from './charts/ProgressRing';
import { WordCloud } from './charts/WordCloud';
import { ReadingHeatmap } from './charts/ReadingHeatmap';
import { BookProgress } from './charts/BookProgress';
import { ReadingVelocity } from './charts/ReadingVelocity';
import { trapFocus, announceToScreenReader, KEYBOARD_KEYS } from '../utils/accessibility';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsDashboard = ({ isOpen, onClose }: AnalyticsDashboardProps) => {
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [weeklyData, setWeeklyData] = useState<{ day: string; minutes: number }[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ month: string; sessions: number }[]>([]);
  const [heatmapData, setHeatmapData] = useState<{ date: string; count: number }[]>([]);
  const [bookProgress, setBookProgress] = useState<{ book: string; chaptersRead: number; totalChapters: number; progress: number }[]>([]);
  const [velocityData, setVelocityData] = useState<{ period: string; versesPerMinute: number }[]>([]);

  useEffect(() => {
    if (isOpen) {
      const readingStats = analyticsManager.getReadingStats();
      const weekly = analyticsManager.getWeeklyData();
      const monthly = analyticsManager.getMonthlyData();
      const heatmap = analyticsManager.getReadingHeatmap();
      const progress = analyticsManager.getBookProgress();
      const velocity = analyticsManager.getReadingVelocity();
      
      setStats(readingStats);
      setWeeklyData(weekly);
      setMonthlyData(monthly);
      setHeatmapData(heatmap);
      setBookProgress(progress);
      setVelocityData(velocity);
      
      announceToScreenReader('Reading analytics dashboard opened');
    }
  }, [isOpen]);

  if (!stats) return null;

  const completionPercentage = (stats.weeklyProgress / stats.weeklyGoal) * 100;
  const streakProgress = Math.min((stats.readingStreak / 30) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-6xl max-h-[90vh] bg-[var(--color-surface)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="analytics-title"
          >
            <div className="p-6 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <h2 id="analytics-title" className="text-2xl font-light text-[var(--color-text)]">Reading Analytics</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[var(--color-border)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  aria-label="Close analytics dashboard"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div
                  className="p-4 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="text-2xl font-bold text-[var(--color-primary)]">{stats.totalSessions}</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">Total Sessions</div>
                </motion.div>

                <motion.div
                  className="p-4 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-2xl font-bold text-[var(--color-primary)]">
                    {Math.round(stats.totalTime / 60000)}m
                  </div>
                  <div className="text-sm text-[var(--color-text-secondary)]">Total Time</div>
                </motion.div>

                <motion.div
                  className="p-4 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-2xl font-bold text-[var(--color-primary)]">{stats.booksCompleted.length}</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">Books Completed</div>
                </motion.div>

                <motion.div
                  className="p-4 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-2xl font-bold text-[var(--color-primary)]">{stats.readingStreak}</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">Day Streak</div>
                </motion.div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <motion.div
                  className="p-6 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <ReadingChart data={weeklyData} goal={30} />
                </motion.div>

                <motion.div
                  className="p-6 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-lg font-medium text-[var(--color-text)] mb-6">Progress</h3>
                  <div className="flex justify-around">
                    <ProgressRing
                      progress={completionPercentage}
                      label="Weekly Goal"
                      value={`${stats.weeklyProgress}/${stats.weeklyGoal}`}
                      size={100}
                    />
                    <ProgressRing
                      progress={streakProgress}
                      label="Streak"
                      value={`${stats.readingStreak} days`}
                      size={100}
                    />
                  </div>
                </motion.div>
              </div>

              {/* New Visualizations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <motion.div
                  className="p-6 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <ReadingHeatmap data={heatmapData} />
                </motion.div>

                <motion.div
                  className="p-6 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <ReadingVelocity data={velocityData} />
                </motion.div>
              </div>

              <motion.div
                className="p-6 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <BookProgress data={bookProgress} />
              </motion.div>

              {/* Monthly Activity */}
              <motion.div
                className="p-6 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-4">Monthly Activity</h3>
                <div className="flex items-end justify-between h-24 gap-2">
                  {monthlyData.map((item, index) => {
                    const maxSessions = Math.max(...monthlyData.map(d => d.sessions));
                    const height = (item.sessions / maxSessions) * 100;
                    
                    return (
                      <div key={item.month} className="flex flex-col items-center flex-1">
                        <div className="relative w-full h-16 bg-[var(--color-border)] rounded-t">
                          <motion.div
                            className="absolute bottom-0 w-full bg-[var(--color-primary)] rounded-t"
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          />
                        </div>
                        <span className="mt-2 text-xs text-[var(--color-text-secondary)]">{item.month}</span>
                        <span className="text-xs font-medium text-[var(--color-text)]">{item.sessions}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Favorite Books */}
              <motion.div
                className="p-6 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-4">Favorite Books</h3>
                <div className="flex flex-wrap gap-2" role="list" aria-label="Most frequently read books">
                  {stats.favoriteBooks.map((book, index) => (
                    <motion.span
                      key={book}
                      className="px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.0 + index * 0.1 }}
                      role="listitem"
                      tabIndex={0}
                      aria-label={`${book}, rank ${index + 1}`}
                    >
                      {book}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
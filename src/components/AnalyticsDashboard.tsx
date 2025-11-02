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
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'goals'>('overview');

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
              <div className="flex items-center justify-between mb-4">
                <h2 id="analytics-title" className="text-2xl font-light text-[var(--color-text)]">Reading Analytics</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[var(--color-border)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  aria-label="Close analytics dashboard"
                >
                  ✕
                </button>
              </div>
              
              {/* Analytics Tabs */}
              <div className="flex space-x-1 bg-[var(--color-border)] rounded-lg p-1">
                {[
                  { id: 'overview', label: 'Overview', icon: '📊' },
                  { id: 'detailed', label: 'Detailed', icon: '📈' },
                  { id: 'goals', label: 'Goals', icon: '🎯' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
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

                <motion.div
                  className="p-4 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((stats.totalTime / 60000) / stats.totalSessions)}
                  </div>
                  <div className="text-sm text-[var(--color-text-secondary)]">Avg Session</div>
                </motion.div>

                <motion.div
                  className="p-4 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.chaptersRead || 0}
                  </div>
                  <div className="text-sm text-[var(--color-text-secondary)]">Chapters Read</div>
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

              {/* Additional Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Reading Habits */}
                <motion.div
                  className="p-6 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <h3 className="text-lg font-medium text-[var(--color-text)] mb-4">📊 Reading Habits</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[var(--color-text-secondary)]">Best Reading Time</span>
                      <span className="text-sm font-medium text-[var(--color-text)]">Evening (7-9 PM)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[var(--color-text-secondary)]">Longest Session</span>
                      <span className="text-sm font-medium text-[var(--color-text)]">45 minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[var(--color-text-secondary)]">Most Active Day</span>
                      <span className="text-sm font-medium text-[var(--color-text)]">Sunday</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[var(--color-text-secondary)]">Reading Speed</span>
                      <span className="text-sm font-medium text-[var(--color-text)]">2.3 verses/min</span>
                    </div>
                  </div>
                </motion.div>

                {/* Testament Progress */}
                <motion.div
                  className="p-6 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <h3 className="text-lg font-medium text-[var(--color-text)] mb-4">📖 Testament Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-[var(--color-text-secondary)]">Old Testament</span>
                        <span className="text-sm font-medium text-[var(--color-text)]">23/39 books</span>
                      </div>
                      <div className="w-full bg-[var(--color-border)] rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '59%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-[var(--color-text-secondary)]">New Testament</span>
                        <span className="text-sm font-medium text-[var(--color-text)]">18/27 books</span>
                      </div>
                      <div className="w-full bg-[var(--color-border)] rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Achievements */}
                <motion.div
                  className="p-6 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <h3 className="text-lg font-medium text-[var(--color-text)] mb-4">🏆 Achievements</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔥</span>
                      <div>
                        <div className="text-sm font-medium text-[var(--color-text)]">7-Day Streak</div>
                        <div className="text-xs text-[var(--color-text-secondary)]">Read for 7 consecutive days</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📚</span>
                      <div>
                        <div className="text-sm font-medium text-[var(--color-text)]">Book Worm</div>
                        <div className="text-xs text-[var(--color-text-secondary)]">Completed 5 books</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⏰</span>
                      <div>
                        <div className="text-sm font-medium text-[var(--color-text)]">Marathon Reader</div>
                        <div className="text-xs text-[var(--color-text-secondary)]">Read for 60+ minutes</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Favorite Books */}
              <motion.div
                className="p-6 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)] mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-4">⭐ Favorite Books</h3>
                <div className="flex flex-wrap gap-2" role="list" aria-label="Most frequently read books">
                  {stats.favoriteBooks.map((book, index) => (
                    <motion.span
                      key={book}
                      className="px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      role="listitem"
                      tabIndex={0}
                      aria-label={`${book}, rank ${index + 1}`}
                    >
                      {book}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Reading Goals */}
              <motion.div
                className="p-6 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
              >
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-4">🎯 Reading Goals</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-[var(--color-surface)]">
                    <div className="text-2xl font-bold text-blue-600">15/30</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">Minutes Today</div>
                    <div className="w-full bg-[var(--color-border)] rounded-full h-2 mt-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-[var(--color-surface)]">
                    <div className="text-2xl font-bold text-green-600">4/7</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">Days This Week</div>
                    <div className="w-full bg-[var(--color-border)] rounded-full h-2 mt-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '57%' }}></div>
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-[var(--color-surface)]">
                    <div className="text-2xl font-bold text-purple-600">8/12</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">Books This Year</div>
                    <div className="w-full bg-[var(--color-border)] rounded-full h-2 mt-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
                </div>
              )}
              
              {activeTab === 'detailed' && (
                <div className="space-y-8">
                  {/* Detailed Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                      className="p-6 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <ReadingHeatmap data={heatmapData} />
                    </motion.div>
                    
                    <motion.div
                      className="p-6 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <ReadingVelocity data={velocityData} />
                    </motion.div>
                  </div>
                  
                  <motion.div
                    className="p-6 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <BookProgress data={bookProgress} />
                  </motion.div>
                  
                  {/* Word Cloud */}
                  <motion.div
                    className="p-6 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <WordCloud words={[
                      { text: 'love', value: 45 },
                      { text: 'faith', value: 38 },
                      { text: 'hope', value: 32 },
                      { text: 'peace', value: 28 },
                      { text: 'joy', value: 25 },
                      { text: 'grace', value: 22 },
                      { text: 'truth', value: 20 },
                      { text: 'light', value: 18 }
                    ]} />
                  </motion.div>
                </div>
              )}
              
              {activeTab === 'goals' && (
                <div className="space-y-8">
                  {/* Current Goals */}
                  <motion.div
                    className="p-6 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="text-lg font-medium text-[var(--color-text)] mb-6">🎯 Current Goals</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-lg bg-[var(--color-surface)]">
                        <h4 className="font-medium text-[var(--color-text)] mb-2">Daily Reading</h4>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-[var(--color-text-secondary)]">15/30 minutes</span>
                          <span className="text-sm font-medium text-blue-600">50%</span>
                        </div>
                        <div className="w-full bg-[var(--color-border)] rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-[var(--color-surface)]">
                        <h4 className="font-medium text-[var(--color-text)] mb-2">Weekly Consistency</h4>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-[var(--color-text-secondary)]">4/7 days</span>
                          <span className="text-sm font-medium text-green-600">57%</span>
                        </div>
                        <div className="w-full bg-[var(--color-border)] rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '57%' }}></div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-[var(--color-surface)]">
                        <h4 className="font-medium text-[var(--color-text)] mb-2">Annual Books</h4>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-[var(--color-text-secondary)]">8/12 books</span>
                          <span className="text-sm font-medium text-purple-600">67%</span>
                        </div>
                        <div className="w-full bg-[var(--color-border)] rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-[var(--color-surface)]">
                        <h4 className="font-medium text-[var(--color-text)] mb-2">Reading Streak</h4>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-[var(--color-text-secondary)]">{stats.readingStreak}/30 days</span>
                          <span className="text-sm font-medium text-orange-600">{Math.round((stats.readingStreak/30)*100)}%</span>
                        </div>
                        <div className="w-full bg-[var(--color-border)] rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${(stats.readingStreak/30)*100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Goal Setting */}
                  <motion.div
                    className="p-6 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-lg font-medium text-[var(--color-text)] mb-6">⚙️ Set New Goals</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                          Daily Reading Time (minutes)
                        </label>
                        <input
                          type="number"
                          defaultValue={30}
                          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                          Books Per Year
                        </label>
                        <input
                          type="number"
                          defaultValue={12}
                          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                          Weekly Reading Days
                        </label>
                        <input
                          type="number"
                          defaultValue={7}
                          max={7}
                          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                          Streak Goal (days)
                        </label>
                        <input
                          type="number"
                          defaultValue={30}
                          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <button className="mt-6 px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity">
                      Update Goals
                    </button>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
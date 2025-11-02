import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  icon: string;
  readings: DailyReading[];
}

interface DailyReading {
  day: number;
  book: string;
  chapters: number[];
  theme?: string;
}

interface Progress {
  planId: string;
  completedDays: number[];
  startDate: string;
  currentStreak: number;
  longestStreak: number;
}

const readingPlans: ReadingPlan[] = [
  {
    id: '30-day-psalms',
    name: '30-Day Psalms',
    description: 'Read through Psalms in 30 days',
    duration: 30,
    icon: '🎵',
    readings: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      book: 'Psalms',
      chapters: [Math.floor(i * 5) + 1, Math.floor(i * 5) + 5].filter(c => c <= 150),
      theme: i < 10 ? 'Praise' : i < 20 ? 'Trust' : 'Wisdom'
    }))
  },
  {
    id: '90-day-nt',
    name: '90-Day New Testament',
    description: 'Complete New Testament in 90 days',
    duration: 90,
    icon: '📖',
    readings: [
      { day: 1, book: 'Matthew', chapters: [1, 2, 3], theme: 'Birth of Jesus' },
      { day: 2, book: 'Matthew', chapters: [4, 5, 6], theme: 'Sermon on the Mount' },
      { day: 3, book: 'Matthew', chapters: [7, 8, 9], theme: 'Miracles' },
      // ... more readings would be here
    ]
  },
  {
    id: 'chronological',
    name: 'Chronological Bible',
    description: 'Read the Bible in historical order',
    duration: 365,
    icon: '📅',
    readings: [
      { day: 1, book: 'Genesis', chapters: [1, 2, 3], theme: 'Creation' },
      { day: 2, book: 'Genesis', chapters: [4, 5, 6], theme: 'Fall and Flood' },
      // ... more readings would be here
    ]
  }
];

interface ReadingPlansProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (book: string, chapter: number) => void;
}

export const ReadingPlans: React.FC<ReadingPlansProps> = ({
  isOpen, onClose, onNavigate
}) => {
  const { currentTheme } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const [showBadges, setShowBadges] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('reading-plans-progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  const startPlan = (planId: string) => {
    const newProgress: Progress = {
      planId,
      completedDays: [],
      startDate: new Date().toISOString(),
      currentStreak: 0,
      longestStreak: 0
    };
    
    const updated = { ...progress, [planId]: newProgress };
    setProgress(updated);
    localStorage.setItem('reading-plans-progress', JSON.stringify(updated));
    setSelectedPlan(planId);
  };

  const markDayComplete = (planId: string, day: number) => {
    const planProgress = progress[planId];
    if (!planProgress) return;

    const completedDays = [...planProgress.completedDays];
    if (!completedDays.includes(day)) {
      completedDays.push(day);
      completedDays.sort((a, b) => a - b);
      
      // Calculate streak
      let currentStreak = 0;
      for (let i = completedDays.length - 1; i >= 0; i--) {
        if (i === completedDays.length - 1 || completedDays[i] === completedDays[i + 1] - 1) {
          currentStreak++;
        } else {
          break;
        }
      }

      const updated = {
        ...progress,
        [planId]: {
          ...planProgress,
          completedDays,
          currentStreak,
          longestStreak: Math.max(planProgress.longestStreak, currentStreak)
        }
      };
      
      setProgress(updated);
      localStorage.setItem('reading-plans-progress', JSON.stringify(updated));
    }
  };

  const getBadges = (planProgress: Progress, plan: ReadingPlan) => {
    const badges = [];
    const completionRate = planProgress.completedDays.length / plan.duration;
    
    if (planProgress.currentStreak >= 7) badges.push({ name: 'Week Warrior', icon: '🔥' });
    if (planProgress.currentStreak >= 30) badges.push({ name: 'Month Master', icon: '👑' });
    if (completionRate >= 0.25) badges.push({ name: 'Quarter Complete', icon: '🥉' });
    if (completionRate >= 0.5) badges.push({ name: 'Halfway Hero', icon: '🥈' });
    if (completionRate >= 1) badges.push({ name: 'Plan Complete', icon: '🥇' });
    
    return badges;
  };

  if (!isOpen) return null;

  const currentPlan = selectedPlan ? readingPlans.find(p => p.id === selectedPlan) : null;
  const currentProgress = selectedPlan ? progress[selectedPlan] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: currentTheme.colors.surface,
          border: `1px solid ${currentTheme.colors.border}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b" style={{ borderColor: currentTheme.colors.border }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold" style={{ color: currentTheme.colors.text }}>
              {currentPlan ? currentPlan.name : 'Reading Plans'}
            </h2>
            <div className="flex items-center gap-2">
              {currentProgress && (
                <button
                  onClick={() => setShowBadges(true)}
                  className="px-3 py-1 text-sm rounded-full"
                  style={{
                    backgroundColor: currentTheme.colors.primary + '20',
                    color: currentTheme.colors.primary
                  }}
                >
                  🏆 Badges
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          {!currentPlan ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {readingPlans.map(plan => {
                const planProgress = progress[plan.id];
                const completionRate = planProgress ? planProgress.completedDays.length / plan.duration : 0;
                
                return (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 rounded-lg border cursor-pointer transition-all"
                    style={{
                      backgroundColor: currentTheme.colors.background,
                      borderColor: currentTheme.colors.border
                    }}
                    onClick={() => planProgress ? setSelectedPlan(plan.id) : startPlan(plan.id)}
                  >
                    <div className="text-3xl mb-3">{plan.icon}</div>
                    <h3 className="font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
                      {plan.name}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: currentTheme.colors.textSecondary }}>
                      {plan.description}
                    </p>
                    
                    {planProgress ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span style={{ color: currentTheme.colors.text }}>
                            {Math.round(completionRate * 100)}% Complete
                          </span>
                          <span style={{ color: currentTheme.colors.textSecondary }}>
                            {planProgress.completedDays.length}/{plan.duration} days
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${completionRate * 100}%`,
                              backgroundColor: currentTheme.colors.primary
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span>🔥 {planProgress.currentStreak} day streak</span>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="w-full py-2 rounded-lg text-sm font-medium"
                        style={{
                          backgroundColor: currentTheme.colors.primary,
                          color: 'white'
                        }}
                      >
                        Start Plan
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="p-2 rounded-lg hover:opacity-70"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  ← Back
                </button>
                <div>
                  <h3 className="font-semibold" style={{ color: currentTheme.colors.text }}>
                    {currentPlan.name}
                  </h3>
                  {currentProgress && (
                    <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                      {currentProgress.completedDays.length}/{currentPlan.duration} days • 
                      🔥 {currentProgress.currentStreak} streak
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-3">
                {currentPlan.readings.slice(0, 30).map(reading => {
                  const isCompleted = currentProgress?.completedDays.includes(reading.day);
                  const isToday = reading.day === (currentProgress?.completedDays.length || 0) + 1;
                  
                  return (
                    <motion.div
                      key={reading.day}
                      className="flex items-center gap-4 p-4 rounded-lg border"
                      style={{
                        backgroundColor: isCompleted ? currentTheme.colors.primary + '10' : currentTheme.colors.surface,
                        borderColor: isToday ? currentTheme.colors.primary : currentTheme.colors.border
                      }}
                    >
                      <div className="flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                          style={{
                            backgroundColor: isCompleted ? currentTheme.colors.primary : currentTheme.colors.background,
                            color: isCompleted ? 'white' : currentTheme.colors.text
                          }}
                        >
                          {isCompleted ? '✓' : reading.day}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium" style={{ color: currentTheme.colors.text }}>
                          {reading.book} {reading.chapters.join('-')}
                        </div>
                        {reading.theme && (
                          <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                            Theme: {reading.theme}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => onNavigate(reading.book, reading.chapters[0])}
                          className="px-3 py-1 text-sm rounded"
                          style={{
                            backgroundColor: currentTheme.colors.primary,
                            color: 'white'
                          }}
                        >
                          Read
                        </button>
                        {!isCompleted && (
                          <button
                            onClick={() => markDayComplete(currentPlan.id, reading.day)}
                            className="px-3 py-1 text-sm rounded border"
                            style={{
                              borderColor: currentTheme.colors.border,
                              color: currentTheme.colors.text
                            }}
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Badges Modal */}
      <AnimatePresence>
        {showBadges && currentProgress && currentPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
            onClick={() => setShowBadges(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
              style={{
                backgroundColor: currentTheme.colors.surface,
                border: `1px solid ${currentTheme.colors.border}`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-4" style={{ color: currentTheme.colors.text }}>
                  Your Badges
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {getBadges(currentProgress, currentPlan).map(badge => (
                    <div
                      key={badge.name}
                      className="p-4 rounded-lg text-center"
                      style={{ backgroundColor: currentTheme.colors.background }}
                    >
                      <div className="text-2xl mb-2">{badge.icon}</div>
                      <div className="text-sm font-medium" style={{ color: currentTheme.colors.text }}>
                        {badge.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
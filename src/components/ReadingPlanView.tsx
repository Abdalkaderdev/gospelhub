import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReadingPlanManager, ReadingPlan, ReadingPlanDay } from '../readingPlan';
import { NotificationManager } from '../notifications';
import { ReadingStatsDashboard } from './ReadingStatsDashboard';
import { ProgressRing } from './ProgressRing';
import { 
  Calendar, 
  CheckCircle, 
  Circle, 
  Bell, 
  Settings, 
  Play, 
  BookOpen,
  Target,
  Clock
} from 'lucide-react';

interface ReadingPlanViewProps {
  className?: string;
}

export const ReadingPlanView: React.FC<ReadingPlanViewProps> = ({ className = '' }) => {
  const [planManager] = useState(() => new ReadingPlanManager());
  const [notificationManager] = useState(() => new NotificationManager());
  const [currentPlan, setCurrentPlan] = useState<ReadingPlan | null>(null);
  const [todaysReading, setTodaysReading] = useState<ReadingPlanDay | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(planManager.getStats());

  useEffect(() => {
    const plan = planManager.getCurrentPlan();
    setCurrentPlan(plan);
    setTodaysReading(planManager.getTodaysReading());
    setStats(planManager.getStats());
  }, [planManager]);

  const handleStartPlan = async (planId: string) => {
    planManager.setCurrentPlan(planId);
    const plan = planManager.getCurrentPlan();
    if (plan) {
      plan.startDate = new Date();
      setCurrentPlan(plan);
      setTodaysReading(planManager.getTodaysReading());
      
      // Request notification permission
      await notificationManager.requestPermission();
    }
  };

  const handleMarkComplete = (day: number) => {
    if (!currentPlan) return;
    
    planManager.markDayComplete(currentPlan.id, day);
    setStats(planManager.getStats());
    
    const newStats = planManager.getStats();
    const progress = Math.round((newStats.completedDays / newStats.totalDays) * 100);
    
    // Show notifications for milestones
    if (newStats.currentStreak > 0 && newStats.currentStreak % 7 === 0) {
      notificationManager.showStreakReminder(newStats.currentStreak);
    }
    
    if (progress > 0 && progress % 25 === 0) {
      notificationManager.showPlanCompletionAlert(currentPlan.name, progress);
    }
  };

  const handleNotificationSettings = async () => {
    const hasPermission = await notificationManager.requestPermission();
    if (hasPermission) {
      setShowSettings(true);
    }
  };

  const defaultPlans = [
    {
      id: 'bible-year',
      name: 'Bible in a Year',
      description: 'Read through the entire Bible in 365 days',
      duration: 365,
      color: 'bg-blue-500'
    },
    {
      id: 'new-testament',
      name: 'New Testament in 90 Days',
      description: 'Read through the New Testament in 3 months',
      duration: 90,
      color: 'bg-green-500'
    },
    {
      id: 'psalms',
      name: 'Psalms',
      description: 'Read through all 150 Psalms',
      duration: 150,
      color: 'bg-purple-500'
    }
  ];

  if (!currentPlan) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg ${className}`}
      >
        <div className="text-center mb-8">
          <BookOpen className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Choose a Reading Plan</h2>
          <p className="text-stone-600">Start your Bible reading journey with a structured plan</p>
        </div>

        <div className="grid gap-4">
          {defaultPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border border-stone-200 rounded-xl hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleStartPlan(plan.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${plan.color} rounded-lg flex items-center justify-center`}>
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-stone-800">{plan.name}</h3>
                  <p className="text-sm text-stone-600">{plan.description}</p>
                  <p className="text-xs text-stone-500 mt-1">{plan.duration} days</p>
                </div>
                <Play className="w-5 h-5 text-amber-600" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  const completionPercentage = Math.round((stats.completedDays / stats.totalDays) * 100);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">{currentPlan.name}</h1>
            <p className="text-stone-600">{currentPlan.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleNotificationSettings}
              className="p-2 text-stone-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowStats(!showStats)}
              className="p-2 text-stone-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            >
              <Target className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <ProgressRing
            progress={completionPercentage}
            size={80}
            strokeWidth={6}
            showPercentage={false}
          />
          <div className="flex-1">
            <div className="flex items-center gap-4 text-sm text-stone-600">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                {stats.completedDays} completed
              </span>
              <span className="flex items-center gap-1">
                <Circle className="w-4 h-4" />
                {stats.totalDays - stats.completedDays} remaining
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {stats.currentStreak} day streak
              </span>
            </div>
            <div className="mt-2 bg-stone-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="bg-amber-500 h-2 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Today's Reading */}
      {todaysReading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200"
        >
          <h2 className="text-lg font-semibold text-amber-800 mb-3">Today's Reading</h2>
          <div className="space-y-2">
            {todaysReading.readings.map((reading, index) => (
              <div key={index} className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span className="text-stone-700">
                  {reading.book} {reading.chapter}
                  {reading.verse && `:${reading.verse}`}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => handleMarkComplete(todaysReading.day)}
            disabled={todaysReading.completed}
            className={`mt-4 px-4 py-2 rounded-lg font-medium transition-all ${
              todaysReading.completed
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm hover:shadow-md'
            }`}
          >
            {todaysReading.completed ? (
              <>
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Completed
              </>
            ) : (
              'Mark as Complete'
            )}
          </button>
        </motion.div>
      )}

      {/* Statistics Dashboard */}
      <AnimatePresence>
        {showStats && (
          <ReadingStatsDashboard stats={stats} />
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-6 h-6 text-stone-600" />
                <h3 className="text-lg font-semibold">Notification Settings</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-stone-700">Daily Reminders</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-700">Streak Notifications</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-700">Progress Alerts</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div>
                  <label className="block text-stone-700 mb-2">Reminder Time</label>
                  <input
                    type="time"
                    defaultValue="08:00"
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="w-full mt-6 bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition-colors"
              >
                Save Settings
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
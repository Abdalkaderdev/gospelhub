import { ReadingPlan, ReadingProgress, DailyReading } from '../types/spiritual-growth';
import { StorageManager } from '../storage';

export class ReadingPlanService {
  private storage: StorageManager;

  constructor(storage: StorageManager) {
    this.storage = storage;
  }

  // Get all available reading plans
  async getAvailablePlans(): Promise<ReadingPlan[]> {
    const { getAllReadingPlans } = await import('../data/reading-plans');
    return getAllReadingPlans();
  }

  // Get a specific reading plan
  async getPlan(planId: string): Promise<ReadingPlan | null> {
    const { getReadingPlan } = await import('../data/reading-plans');
    return getReadingPlan(planId) || null;
  }

  // Start a new reading plan
  async startPlan(planId: string): Promise<ReadingProgress> {
    const plan = await this.getPlan(planId);
    if (!plan) {
      throw new Error('Reading plan not found');
    }

    const progress: ReadingProgress = {
      planId,
      currentDay: 1,
      completedDays: [],
      streak: 0,
      longestStreak: 0,
      startDate: new Date().toISOString().split('T')[0],
      isCompleted: false
    };

    await this.storage.saveReadingProgress(progress);
    return progress;
  }

  // Get user's reading progress
  async getProgress(planId: string): Promise<ReadingProgress | null> {
    const allProgress = await this.storage.getReadingPlanProgress();
    return allProgress[planId] || null;
  }

  // Mark a day as completed
  async markDayCompleted(planId: string, day: number): Promise<ReadingProgress> {
    const progress = await this.getProgress(planId);
    if (!progress) {
      throw new Error('Reading plan not started');
    }

    const plan = await this.getPlan(planId);
    if (!plan) {
      throw new Error('Reading plan not found');
    }

    // Add day to completed days if not already completed
    if (!progress.completedDays.includes(day)) {
      progress.completedDays.push(day);
    }

    // Update current day
    progress.currentDay = Math.max(progress.currentDay, day + 1);

    // Calculate streak
    progress.streak = this.calculateStreak(progress.completedDays);
    progress.longestStreak = Math.max(progress.longestStreak, progress.streak);

    // Update last read date
    progress.lastReadDate = new Date().toISOString().split('T')[0];

    // Check if plan is completed
    if (progress.completedDays.length >= plan.totalDays) {
      progress.isCompleted = true;
      progress.completionDate = new Date().toISOString().split('T')[0];
    }

    await this.storage.saveReadingProgress(progress);
    return progress;
  }

  // Get today's reading
  async getTodaysReading(planId: string): Promise<DailyReading | null> {
    const progress = await this.getProgress(planId);
    if (!progress) {
      return null;
    }

    const plan = await this.getPlan(planId);
    if (!plan) {
      return null;
    }

    return plan.dailyReadings.find(reading => reading.day === progress.currentDay) || null;
  }

  // Get reading for a specific day
  async getReadingForDay(planId: string, day: number): Promise<DailyReading | null> {
    const plan = await this.getPlan(planId);
    if (!plan) {
      return null;
    }

    return plan.dailyReadings.find(reading => reading.day === day) || null;
  }

  // Calculate reading streak
  private calculateStreak(completedDays: number[]): number {
    if (completedDays.length === 0) return 0;

    const sortedDays = [...completedDays].sort((a, b) => b - a);
    let streak = 0;
    let currentDay = sortedDays[0];

    for (const day of sortedDays) {
      if (day === currentDay) {
        streak++;
        currentDay--;
      } else {
        break;
      }
    }

    return streak;
  }

  // Get progress statistics
  async getProgressStats(planId: string): Promise<{
    totalDays: number;
    completedDays: number;
    remainingDays: number;
    progressPercentage: number;
    streak: number;
    longestStreak: number;
    isCompleted: boolean;
  }> {
    const progress = await this.getProgress(planId);
    const plan = await this.getPlan(planId);

    if (!progress || !plan) {
      return {
        totalDays: 0,
        completedDays: 0,
        remainingDays: 0,
        progressPercentage: 0,
        streak: 0,
        longestStreak: 0,
        isCompleted: false
      };
    }

    const completedDays = progress.completedDays.length;
    const remainingDays = plan.totalDays - completedDays;
    const progressPercentage = (completedDays / plan.totalDays) * 100;

    return {
      totalDays: plan.totalDays,
      completedDays,
      remainingDays,
      progressPercentage,
      streak: progress.streak,
      longestStreak: progress.longestStreak,
      isCompleted: progress.isCompleted
    };
  }

  // Get all user's reading plans
  async getAllUserPlans(): Promise<ReadingProgress[]> {
    const allProgress = await this.storage.getReadingPlanProgress();
    return Object.values(allProgress);
  }

  // Delete a reading plan
  async deletePlan(planId: string): Promise<void> {
    await this.storage.deleteReadingProgress(planId);
  }

  // Reset a reading plan
  async resetPlan(planId: string): Promise<ReadingProgress> {
    await this.storage.deleteReadingProgress(planId);
    return this.startPlan(planId);
  }
}
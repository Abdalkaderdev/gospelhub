import { BibleReference } from '../types';

export interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  readings: ReadingPlanDay[];
  startDate?: Date;
  completedDays: Set<number>;
}

export interface ReadingPlanDay {
  day: number;
  readings: BibleReference[];
  completed: boolean;
  completedAt?: Date;
}

export interface ReadingStats {
  totalDays: number;
  completedDays: number;
  currentStreak: number;
  longestStreak: number;
  averageReadingTime: number;
  booksCompleted: string[];
  chaptersRead: number;
  versesRead: number;
}

export class ReadingPlanManager {
  private plans: Map<string, ReadingPlan> = new Map();
  private currentPlan: string | null = null;
  private stats: ReadingStats = {
    totalDays: 0,
    completedDays: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageReadingTime: 0,
    booksCompleted: [],
    chaptersRead: 0,
    versesRead: 0
  };

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultPlans();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem('readingPlans');
    if (stored) {
      const data = JSON.parse(stored);
      this.plans = new Map(data.plans);
      this.currentPlan = data.currentPlan;
      this.stats = data.stats || this.stats;
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('readingPlans', JSON.stringify({
      plans: Array.from(this.plans.entries()),
      currentPlan: this.currentPlan,
      stats: this.stats
    }));
  }

  private initializeDefaultPlans(): void {
    if (this.plans.size === 0) {
      this.addPlan(this.createBibleInAYearPlan());
      this.addPlan(this.createNewTestamentPlan());
      this.addPlan(this.createPsalmsPlan());
    }
  }

  private createBibleInAYearPlan(): ReadingPlan {
    const readings: ReadingPlanDay[] = [];
    for (let day = 1; day <= 365; day++) {
      readings.push({
        day,
        readings: [{ book: 'Genesis', chapter: Math.ceil(day / 12) }],
        completed: false
      });
    }

    return {
      id: 'bible-year',
      name: 'Bible in a Year',
      description: 'Read through the entire Bible in 365 days',
      duration: 365,
      readings,
      completedDays: new Set()
    };
  }

  private createNewTestamentPlan(): ReadingPlan {
    const readings: ReadingPlanDay[] = [];
    for (let day = 1; day <= 90; day++) {
      readings.push({
        day,
        readings: [{ book: 'Matthew', chapter: Math.ceil(day / 3) }],
        completed: false
      });
    }

    return {
      id: 'new-testament',
      name: 'New Testament in 90 Days',
      description: 'Read through the New Testament in 3 months',
      duration: 90,
      readings,
      completedDays: new Set()
    };
  }

  private createPsalmsPlan(): ReadingPlan {
    const readings: ReadingPlanDay[] = [];
    for (let day = 1; day <= 150; day++) {
      readings.push({
        day,
        readings: [{ book: 'Psalms', chapter: day }],
        completed: false
      });
    }

    return {
      id: 'psalms',
      name: 'Psalms',
      description: 'Read through all 150 Psalms',
      duration: 150,
      readings,
      completedDays: new Set()
    };
  }

  addPlan(plan: ReadingPlan): void {
    this.plans.set(plan.id, plan);
    this.saveToStorage();
  }

  setCurrentPlan(planId: string): void {
    if (this.plans.has(planId)) {
      this.currentPlan = planId;
      this.saveToStorage();
    }
  }

  getCurrentPlan(): ReadingPlan | null {
    return this.currentPlan ? this.plans.get(this.currentPlan) || null : null;
  }

  markDayComplete(planId: string, day: number): void {
    const plan = this.plans.get(planId);
    if (plan) {
      plan.completedDays.add(day);
      const reading = plan.readings.find(r => r.day === day);
      if (reading) {
        reading.completed = true;
        reading.completedAt = new Date();
      }
      this.updateStats();
      this.saveToStorage();
    }
  }

  private updateStats(): void {
    const plan = this.getCurrentPlan();
    if (!plan) return;

    this.stats.totalDays = plan.duration;
    this.stats.completedDays = plan.completedDays.size;
    this.stats.currentStreak = this.calculateCurrentStreak(plan);
    this.stats.longestStreak = this.calculateLongestStreak(plan);
  }

  private calculateCurrentStreak(plan: ReadingPlan): number {
    let streak = 0;
    const today = new Date();
    const startDate = plan.startDate || new Date();
    
    for (let i = this.getDaysSinceStart(startDate, today); i >= 1; i--) {
      if (plan.completedDays.has(i)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  private calculateLongestStreak(plan: ReadingPlan): number {
    let longest = 0;
    let current = 0;
    
    for (let day = 1; day <= plan.duration; day++) {
      if (plan.completedDays.has(day)) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 0;
      }
    }
    return longest;
  }

  private getDaysSinceStart(startDate: Date, currentDate: Date): number {
    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getStats(): ReadingStats {
    return { ...this.stats };
  }

  getTodaysReading(): ReadingPlanDay | null {
    const plan = this.getCurrentPlan();
    if (!plan || !plan.startDate) return null;

    const today = new Date();
    const dayNumber = this.getDaysSinceStart(plan.startDate, today);
    
    return plan.readings.find(r => r.day === dayNumber) || null;
  }
}
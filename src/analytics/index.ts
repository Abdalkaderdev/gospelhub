import { ReadingSession, ReadingStats, WordFrequency, BibleReference } from '../types';

export class AnalyticsManager {
  private sessions: ReadingSession[] = [];
  private currentSession: ReadingSession | null = null;

  constructor() {
    this.loadSessions();
  }

  startSession(book: string, chapter: number, translation: string): void {
    this.currentSession = {
      id: `session-${Date.now()}`,
      startTime: new Date(),
      book,
      chapter,
      versesRead: [],
      duration: 0,
      translation
    };
  }

  endSession(): void {
    if (this.currentSession) {
      this.currentSession.endTime = new Date();
      this.currentSession.duration = this.currentSession.endTime.getTime() - this.currentSession.startTime.getTime();
      this.sessions.push(this.currentSession);
      this.saveSessions();
      this.currentSession = null;
    }
  }

  recordVerseRead(verse: number): void {
    if (this.currentSession && !this.currentSession.versesRead.includes(verse)) {
      this.currentSession.versesRead.push(verse);
    }
  }

  getReadingStats(): ReadingStats {
    const totalSessions = this.sessions.length;
    const totalTime = this.sessions.reduce((sum, session) => sum + session.duration, 0);
    
    const chaptersRead: { [book: string]: number[] } = {};
    const bookCounts: { [book: string]: number } = {};
    
    this.sessions.forEach(session => {
      if (!chaptersRead[session.book]) {
        chaptersRead[session.book] = [];
      }
      if (!chaptersRead[session.book].includes(session.chapter)) {
        chaptersRead[session.book].push(session.chapter);
      }
      bookCounts[session.book] = (bookCounts[session.book] || 0) + 1;
    });

    const favoriteBooks = Object.entries(bookCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([book]) => book);

    const booksCompleted = Object.entries(chaptersRead)
      .filter(([, chapters]) => this.isBookComplete(chapters))
      .map(([book]) => book);

    return {
      totalSessions,
      totalTime,
      booksCompleted,
      chaptersRead,
      favoriteBooks,
      readingStreak: this.calculateStreak(),
      weeklyGoal: this.getWeeklyGoal(),
      weeklyProgress: this.getWeeklyProgress()
    };
  }

  getWeeklyData(): { day: string; minutes: number }[] {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      return {
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        minutes: 0
      };
    });

    this.sessions.forEach(session => {
      const sessionDate = new Date(session.startTime);
      if (sessionDate >= weekStart) {
        const dayIndex = sessionDate.getDay();
        weekData[dayIndex].minutes += Math.round(session.duration / 60000);
      }
    });

    return weekData;
  }

  getMonthlyData(): { month: string; sessions: number }[] {
    const monthlyData: { [key: string]: number } = {};
    
    this.sessions.forEach(session => {
      const monthKey = new Date(session.startTime).toLocaleDateString('en', { 
        year: 'numeric', 
        month: 'short' 
      });
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .map(([month, sessions]) => ({ month, sessions }))
      .slice(-12);
  }

  analyzeWordFrequency(text: string): WordFrequency[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);

    const frequency: { [word: string]: number } = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .map(([word, count]) => ({ word, count, verses: [] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }

  private calculateStreak(): number {
    if (this.sessions.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const hasSession = this.sessions.some(session => {
        const sessionDate = new Date(session.startTime);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === currentDate.getTime();
      });

      if (hasSession) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  private isBookComplete(chapters: number[]): boolean {
    return chapters.length >= 10; // Simplified completion check
  }

  private getWeeklyGoal(): number {
    return parseInt(localStorage.getItem('bible-reader-weekly-goal') || '7');
  }

  private getWeeklyProgress(): number {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    return this.sessions.filter(session => 
      new Date(session.startTime) >= weekStart
    ).length;
  }

  private saveSessions(): void {
    localStorage.setItem('bible-reader-sessions', JSON.stringify(this.sessions));
  }

  private loadSessions(): void {
    try {
      const saved = localStorage.getItem('bible-reader-sessions');
      if (saved) {
        this.sessions = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load sessions:', error);
    }
  }
}

export const analyticsManager = new AnalyticsManager();
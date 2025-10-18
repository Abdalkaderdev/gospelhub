// Reading Plans Types
export interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  totalDays: number;
  category: 'bible-in-year' | 'new-testament' | 'psalms-proverbs' | 'custom';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  dailyReadings: DailyReading[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyReading {
  day: number;
  date: string; // YYYY-MM-DD format
  readings: ReadingAssignment[];
  theme?: string;
  reflection?: string;
}

export interface ReadingAssignment {
  book: string;
  chapter: number;
  startVerse?: number;
  endVerse?: number;
  description?: string;
}

export interface ReadingProgress {
  planId: string;
  currentDay: number;
  completedDays: number[];
  streak: number;
  longestStreak: number;
  startDate: string;
  lastReadDate?: string;
  isCompleted: boolean;
  completionDate?: string;
}

// God's Promises Types
export interface PromiseCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface GodsPromise {
  id: string;
  title: string;
  description: string;
  category: string;
  verses: PromiseVerse[];
  application: string;
  prayer: string;
  isClaimed: boolean;
  claimedDate?: string;
  isFavorite: boolean;
}

export interface PromiseVerse {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: number;
}

// Bag of Life Types
export interface BagItem {
  id: string;
  type: 'prayer' | 'reflection' | 'note' | 'answer';
  title: string;
  content: string;
  category?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
  isFavorite: boolean;
}

export interface PrayerRequest extends BagItem {
  type: 'prayer';
  status: 'praying' | 'answered' | 'paused';
  answeredDate?: string;
  answer?: string;
  relatedVerses?: string[];
}

export interface Reflection extends BagItem {
  type: 'reflection';
  relatedVerse?: string;
  mood?: 'grateful' | 'struggling' | 'hopeful' | 'peaceful' | 'seeking';
}

export interface SpiritualNote extends BagItem {
  type: 'note';
  topic: string;
  relatedVerses?: string[];
}

export interface AnswerToPrayer extends BagItem {
  type: 'answer';
  originalPrayerId?: string;
  answerDate: string;
  testimony: string;
}

// Bible Dictionary Types
export interface DictionaryEntry {
  id: string;
  term: string;
  pronunciation?: string;
  definition: string;
  etymology?: string;
  category: 'theology' | 'person' | 'place' | 'concept' | 'event';
  relatedTerms: string[];
  verses: DictionaryVerse[];
  practicalApplication: string;
  isFavorite: boolean;
  searchCount: number;
}

export interface DictionaryVerse {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: number;
  context?: string;
}

// UI State Types
export interface SpiritualGrowthState {
  activeTab: 'reader' | 'plans' | 'promises' | 'bag' | 'dictionary';
  selectedPlan?: string;
  selectedCategory?: string;
  searchQuery: string;
  filterOptions: {
    category?: string;
    dateRange?: { start: string; end: string };
    status?: string;
  };
}

// Notification Types
export interface SpiritualReminder {
  id: string;
  type: 'daily-reading' | 'prayer-reminder' | 'promise-claim' | 'reflection';
  title: string;
  message: string;
  scheduledTime: string; // HH:MM format
  isEnabled: boolean;
  lastSent?: string;
}

// Statistics Types
export interface SpiritualStats {
  readingStreak: number;
  totalVersesRead: number;
  promisesClaimed: number;
  prayersAnswered: number;
  reflectionsWritten: number;
  dictionaryTermsLearned: number;
  currentPlan?: {
    name: string;
    progress: number;
    daysRemaining: number;
  };
}
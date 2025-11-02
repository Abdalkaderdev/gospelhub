import { ReadingPlan, ReadingPlanDay, BookCategory, BOOK_CATEGORIES } from '../types/bible-enhanced';
import { BibleMetadataService } from './BibleMetadataService';

export class ReadingPlanService {
  static generateReadingPlan(
    type: 'chronological' | 'testament' | 'category',
    options: {
      duration?: number;
      testament?: 'Old' | 'New';
      category?: BookCategory;
      booksPerDay?: number;
    } = {}
  ): ReadingPlan {
    const { duration = 365, testament, category, booksPerDay = 1 } = options;

    switch (type) {
      case 'chronological':
        return this.createChronologicalPlan(duration);
      case 'testament':
        return this.createTestamentPlan(testament || 'Old', duration);
      case 'category':
        return this.createCategoryPlan(category || 'Gospels', duration);
      default:
        return this.createChronologicalPlan(duration);
    }
  }

  private static createChronologicalPlan(duration: number): ReadingPlan {
    const allBooks = [
      ...BibleMetadataService.getTestamentBooks('Old'),
      ...BibleMetadataService.getTestamentBooks('New')
    ];

    const readings = this.distributeBooks(allBooks, duration);

    return {
      id: 'chronological-' + duration,
      name: `${duration}-Day Bible Reading Plan`,
      description: 'Read through the entire Bible in chronological order',
      duration,
      category: 'chronological',
      readings
    };
  }

  private static createTestamentPlan(testament: 'Old' | 'New', duration: number): ReadingPlan {
    const books = BibleMetadataService.getTestamentBooks(testament);
    const readings = this.distributeBooks(books, duration);

    return {
      id: `${testament.toLowerCase()}-testament-${duration}`,
      name: `${testament} Testament - ${duration} Days`,
      description: `Read through the ${testament} Testament`,
      duration,
      category: 'chronological',
      readings
    };
  }

  private static createCategoryPlan(category: BookCategory, duration: number): ReadingPlan {
    const books = BibleMetadataService.getBooksByCategory(category);
    const readings = this.distributeBooks(books, duration);

    return {
      id: `${category.toLowerCase()}-${duration}`,
      name: `${category} Books - ${duration} Days`,
      description: `Focus on ${category} books of the Bible`,
      duration,
      category,
      readings
    };
  }

  private static distributeBooks(books: string[], duration: number): ReadingPlanDay[] {
    const readings: ReadingPlanDay[] = [];
    const chaptersPerBook = this.getChapterCounts();
    
    // Calculate total chapters
    const totalChapters = books.reduce((sum, book) => sum + (chaptersPerBook[book] || 1), 0);
    const chaptersPerDay = Math.ceil(totalChapters / duration);

    let currentDay = 1;
    let currentChapters = 0;
    let dayReadings: ReadingPlanDay['readings'] = [];

    for (const book of books) {
      const bookChapters = chaptersPerBook[book] || 1;
      
      for (let chapter = 1; chapter <= bookChapters; chapter++) {
        dayReadings.push({ book, chapter });
        currentChapters++;

        if (currentChapters >= chaptersPerDay || (book === books[books.length - 1] && chapter === bookChapters)) {
          readings.push({
            day: currentDay,
            readings: [...dayReadings]
          });

          currentDay++;
          currentChapters = 0;
          dayReadings = [];

          if (currentDay > duration) break;
        }
      }
      if (currentDay > duration) break;
    }

    return readings;
  }

  private static getChapterCounts(): Record<string, number> {
    return {
      'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34,
      'Joshua': 24, 'Judges': 21, 'Ruth': 4, '1 Samuel': 31, '2 Samuel': 24,
      '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36,
      'Ezra': 10, 'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150,
      'Proverbs': 31, 'Ecclesiastes': 12, 'Song of Solomon': 8, 'Isaiah': 66,
      'Jeremiah': 52, 'Lamentations': 5, 'Ezekiel': 48, 'Daniel': 12,
      'Hosea': 14, 'Joel': 3, 'Amos': 9, 'Obadiah': 1, 'Jonah': 4,
      'Micah': 7, 'Nahum': 3, 'Habakkuk': 3, 'Zephaniah': 3, 'Haggai': 2,
      'Zechariah': 14, 'Malachi': 4, 'Matthew': 28, 'Mark': 16, 'Luke': 24,
      'John': 21, 'Acts': 28, 'Romans': 16, '1 Corinthians': 16, '2 Corinthians': 13,
      'Galatians': 6, 'Ephesians': 6, 'Philippians': 4, 'Colossians': 4,
      '1 Thessalonians': 5, '2 Thessalonians': 3, '1 Timothy': 6, '2 Timothy': 4,
      'Titus': 3, 'Philemon': 1, 'Hebrews': 13, 'James': 5, '1 Peter': 5,
      '2 Peter': 3, '1 John': 5, '2 John': 1, '3 John': 1, 'Jude': 1, 'Revelation': 22
    };
  }

  static getPopularPlans(): ReadingPlan[] {
    return [
      this.generateReadingPlan('chronological', { duration: 365 }),
      this.generateReadingPlan('chronological', { duration: 90 }),
      this.generateReadingPlan('testament', { testament: 'New', duration: 30 }),
      this.generateReadingPlan('category', { category: 'Gospels', duration: 30 }),
      this.generateReadingPlan('category', { category: 'Psalms', duration: 150 }),
      this.generateReadingPlan('category', { category: 'Proverbs', duration: 31 })
    ];
  }

  static createCustomPlan(
    name: string,
    books: string[],
    duration: number
  ): ReadingPlan {
    const readings = this.distributeBooks(books, duration);

    return {
      id: `custom-${Date.now()}`,
      name,
      description: `Custom reading plan with ${books.length} books`,
      duration,
      category: 'chronological',
      readings
    };
  }

  static getReadingProgress(
    plan: ReadingPlan,
    completedDays: number[]
  ): {
    percentage: number;
    daysCompleted: number;
    daysRemaining: number;
    currentDay: number;
    nextReading?: ReadingPlanDay;
  } {
    const daysCompleted = completedDays.length;
    const percentage = (daysCompleted / plan.duration) * 100;
    const daysRemaining = plan.duration - daysCompleted;
    const currentDay = Math.max(1, daysCompleted + 1);
    const nextReading = plan.readings.find(r => r.day === currentDay);

    return {
      percentage,
      daysCompleted,
      daysRemaining,
      currentDay,
      nextReading
    };
  }

  static generateReadingSchedule(
    plan: ReadingPlan,
    startDate: Date
  ): Array<{ date: Date; reading: ReadingPlanDay }> {
    const schedule: Array<{ date: Date; reading: ReadingPlanDay }> = [];
    
    for (const reading of plan.readings) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + reading.day - 1);
      
      schedule.push({ date, reading });
    }

    return schedule;
  }
}
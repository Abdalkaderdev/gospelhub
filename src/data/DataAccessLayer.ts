import { optimizedBibleService } from '../services/OptimizedBibleService';
import { bibleXMLService } from '../services/BibleXMLService';
import { validateVerse, validateChapter, BibleVerse } from '../types/bible';

export class DataAccessLayer {
  private static instance: DataAccessLayer;
  private fallbackToXML = true;

  static getInstance(): DataAccessLayer {
    if (!DataAccessLayer.instance) {
      DataAccessLayer.instance = new DataAccessLayer();
    }
    return DataAccessLayer.instance;
  }

  async getAvailableTranslations() {
    try {
      await optimizedBibleService.initialize();
      return optimizedBibleService.getAvailableTranslations();
    } catch (error) {
      console.warn('Failed to load processed translations, using fallback');
      return [];
    }
  }

  async getChapter(
    translationId: string, 
    bookName: string, 
    chapterNumber: number
  ): Promise<BibleVerse[]> {
    try {
      // Try optimized service first
      const verses = await optimizedBibleService.loadChapter(translationId, bookName, chapterNumber);
      
      if (verses && this.validateChapterData(verses)) {
        return verses;
      }
    } catch (error) {
      console.warn('Optimized service failed, trying XML fallback:', error);
    }

    // Fallback to XML service
    if (this.fallbackToXML) {
      try {
        const book = await bibleXMLService.loadBook(translationId, bookName);
        const chapter = book?.chapters.find(ch => ch.number === chapterNumber);
        
        if (chapter && this.validateChapterData(chapter.verses)) {
          return chapter.verses;
        }
      } catch (error) {
        console.error('XML fallback also failed:', error);
      }
    }

    throw new Error(`Failed to load ${bookName} chapter ${chapterNumber} from ${translationId}`);
  }

  async getVerse(
    translationId: string, 
    bookName: string, 
    chapterNumber: number, 
    verseNumber: number
  ): Promise<BibleVerse | null> {
    try {
      const verses = await this.getChapter(translationId, bookName, chapterNumber);
      return verses.find(v => v.number === verseNumber) || null;
    } catch (error) {
      console.error('Failed to get verse:', error);
      return null;
    }
  }

  private validateChapterData(verses: any[]): boolean {
    return Array.isArray(verses) && verses.every(validateVerse);
  }

  clearCache(): void {
    optimizedBibleService.clearCache();
    bibleXMLService.clearCache();
  }

  setFallbackEnabled(enabled: boolean): void {
    this.fallbackToXML = enabled;
  }
}

export const dataAccessLayer = DataAccessLayer.getInstance();
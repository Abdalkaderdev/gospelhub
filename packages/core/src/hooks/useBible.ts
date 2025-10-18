import { useEffect, useState } from 'react';
import { Verse, BibleChapter } from '../types';
import { useBibleNavigationStore } from '../stores/bibleNavigationStore';
import { BibleDataService } from '../bible-data-enhanced';

export const useBible = () => {
  const { currentBook, currentChapter, isLoading, error } = useBibleNavigationStore();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [chapterData, setChapterData] = useState<BibleChapter | null>(null);
  const [bookMetadata, setBookMetadata] = useState<{ totalChapters: number; totalVerses: number } | null>(null);

  useEffect(() => {
    const loadChapter = async () => {
      try {
        const service = BibleDataService.getInstance();
        const chapter = service.getChapter(currentBook, currentChapter);
        const metadata = service.getBookMetadata(currentBook);
        
        if (chapter) {
          setChapterData(chapter);
          setVerses(chapter.verses);
        } else {
          setChapterData(null);
          setVerses([]);
        }
        
        setBookMetadata(metadata);
      } catch (error) {
        console.error('Error loading chapter:', error);
        setVerses([]);
        setChapterData(null);
        setBookMetadata(null);
      }
    };

    loadChapter();
  }, [currentBook, currentChapter]);

  const loadChapter = async (book: string, chapter: number) => {
    try {
      const service = BibleDataService.getInstance();
      const chapterData = service.getChapter(book, chapter);
      const metadata = service.getBookMetadata(book);
      
      if (chapterData) {
        setChapterData(chapterData);
        setVerses(chapterData.verses);
      } else {
        setChapterData(null);
        setVerses([]);
      }
      
      setBookMetadata(metadata);
    } catch (error) {
      console.error('Error loading chapter:', error);
      setVerses([]);
      setChapterData(null);
      setBookMetadata(null);
    }
  };

  const getVerse = (verseNumber: number): Verse | undefined => {
    return verses.find(verse => verse.verse === verseNumber);
  };

  const getVersesInRange = (startVerse: number, endVerse: number): Verse[] => {
    return verses.filter(verse => verse.verse >= startVerse && verse.verse <= endVerse);
  };

  return {
    // Current state
    currentBook,
    currentChapter,
    verses,
    chapterData,
    bookMetadata,
    isLoading,
    error,
    
    // Actions
    loadChapter,
    getVerse,
    getVersesInRange,
  };
};
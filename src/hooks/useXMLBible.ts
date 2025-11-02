import { useState, useEffect } from 'react';
import { bibleXMLService } from '../services/BibleXMLService';
import { BibleBook, BibleVerse } from '../types';

export const useXMLBible = (translationId: string) => {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!translationId) return;

    const loadTranslation = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const translationBooks = await bibleXMLService.loadTranslation(translationId);
        setBooks(translationBooks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load translation');
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    loadTranslation();
  }, [translationId]);

  const getBook = (bookName: string): BibleBook | undefined => {
    return books.find(book => 
      book.name.toLowerCase() === bookName.toLowerCase() ||
      book.abbreviation.toLowerCase() === bookName.toLowerCase()
    );
  };

  const getChapter = (bookName: string, chapterNumber: number): BibleVerse[] => {
    const book = getBook(bookName);
    const chapter = book?.chapters.find(ch => ch.number === chapterNumber);
    return chapter?.verses || [];
  };

  const getVerse = (bookName: string, chapterNumber: number, verseNumber: number): BibleVerse | undefined => {
    const verses = getChapter(bookName, chapterNumber);
    return verses.find(verse => verse.number === verseNumber);
  };

  return {
    books,
    loading,
    error,
    getBook,
    getChapter,
    getVerse
  };
};
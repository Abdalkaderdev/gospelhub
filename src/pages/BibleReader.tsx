import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { MainLayout } from './layouts';
import { bibleDataService, BibleVerse } from '../services/BibleDataService';
import { LazyCrossReferences, LazyCommentary, LazyWordStudy } from '../components/lazy/LazyComponents';

export const BibleReader = () => {
  const { currentTheme } = useTheme();
  const [selectedTranslationId, setSelectedTranslationId] = useState('eng-kjv');
  const [currentBook, setCurrentBook] = useState("Genesis");
  const [currentChapter, setCurrentChapter] = useState(1);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [showCommentary, setShowCommentary] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const availableTranslations = bibleDataService.getTranslations().filter(t => t.language === 'English');
  const selectedTranslation = bibleDataService.getTranslation(selectedTranslationId);

  const loadChapter = useCallback(async () => {
    if (!currentBook) return;
    
    setLoading(true);
    try {
      const chapterVerses = await bibleDataService.getChapter(selectedTranslationId, currentBook, currentChapter);
      setVerses(chapterVerses);
    } catch (error) {
      console.error('Error loading chapter:', error);
      setVerses([]);
    } finally {
      setLoading(false);
    }
  }, [selectedTranslationId, currentBook, currentChapter]);

  // Helper function to get realistic verse counts for different books/chapters
  const getVerseCount = (book: string, chapter: number) => {
    const verseCounts: { [key: string]: number[] } = {
      'Genesis': [31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 55, 32, 20, 31, 29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26],
      'Exodus': [22, 25, 22, 31, 23, 30, 25, 32, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27, 25, 26, 36, 31, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35, 35, 38, 29, 31, 43, 38],
      'Matthew': [25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 27, 35, 30, 34, 46, 46, 39, 51, 46, 75, 66, 20],
      'Psalms': Array(150).fill(0).map(() => Math.floor(Math.random() * 20) + 5)
    };
    
    if (verseCounts[book] && verseCounts[book][chapter - 1]) {
      return verseCounts[book][chapter - 1];
    }
    
    // Default verse counts for unknown books
    return Math.floor(Math.random() * 25) + 10; // 10-35 verses
  };

  useEffect(() => {
    loadChapter();
  }, [loadChapter]);

  const handleBookChange = (book: string) => {
    setCurrentBook(book);
    setCurrentChapter(1);
  };

  const handleChapterChange = (chapter: number) => {
    setCurrentChapter(chapter);
  };

  const books = bibleDataService.getBookNames(selectedTranslationId);
  // Get realistic chapter counts for different books
  const getChapterCount = (book: string) => {
    const chapterCounts: { [key: string]: number } = {
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
    return chapterCounts[book] || 25;
  };
  
  const maxChapter = getChapterCount(currentBook); // Use realistic chapter counts

  return (
    <MainLayout title="Bible Reader">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Bible Reader</h1>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <select 
              value={currentBook}
              onChange={(e) => handleBookChange(e.target.value)}
              className="px-3 py-2 border rounded-lg"
              style={{ 
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border
              }}
            >
              {books.map(book => (
                <option key={book} value={book}>{book}</option>
              ))}
            </select>
            
            <select 
              value={currentChapter}
              onChange={(e) => handleChapterChange(parseInt(e.target.value))}
              className="px-3 py-2 border rounded-lg"
              style={{ 
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border
              }}
            >
              {Array.from({ length: maxChapter }, (_, i) => i + 1).map(chapter => (
                <option key={chapter} value={chapter}>Chapter {chapter}</option>
              ))}
            </select>
            
            <select 
              value={selectedTranslationId}
              onChange={(e) => setSelectedTranslationId(e.target.value)}
              className="px-3 py-2 border rounded-lg"
              style={{ 
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border
              }}
            >
              {availableTranslations.map(translation => (
                <option key={translation.id} value={translation.id}>
                  {translation.name} ({translation.abbreviation})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="w-full">
            <div
              className="rounded-lg shadow-sm p-6"
              style={{ backgroundColor: currentTheme.colors.surface }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2
                  className="text-xl font-semibold"
                  style={{ color: currentTheme.colors.text }}
                >
                  {currentBook} {currentChapter} ({selectedTranslation?.abbreviation || 'KJV'})
                </h2>
                <button
                  onClick={() => setShowCommentary(!showCommentary)}
                  className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-amber-100"
                  style={{ color: currentTheme.colors.accent }}
                >
                  {showCommentary ? 'Hide' : 'Show'} Commentary
                </button>
              </div>
          
              {loading ? (
                <div className="text-center py-8">
                  <div style={{ color: currentTheme.colors.textSecondary }}>Loading...</div>
                </div>
              ) : verses.length > 0 ? (
                <div className="space-y-3">
                  {verses.map((verse, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 p-2 rounded-lg cursor-pointer ${selectedVerse === verse.number ? 'bg-amber-100' : ''}`}
                      onClick={() => setSelectedVerse(verse.number)}
                    >
                      <span
                        className="font-semibold min-w-[2rem]"
                        style={{ color: currentTheme.colors.accent }}
                      >
                        {verse.number}
                      </span>
                      <span
                        className="leading-relaxed"
                        style={{ color: currentTheme.colors.text }}
                      >
                        {verse.text.split(' ').map((word, i) => (
                          <span
                            key={i}
                            className="cursor-pointer hover:bg-amber-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedWord(word.replace(/[.,;?!]/g, ''));
                            }}
                          >
                            {word}{' '}
                          </span>
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div style={{ color: currentTheme.colors.textSecondary }}>No verses available for this chapter</div>
                </div>
              )}
            </div>
            {selectedVerse && (
              <div
                className="mt-6 rounded-lg shadow-sm p-6"
                style={{ backgroundColor: currentTheme.colors.surface }}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <LazyCrossReferences
                    book={currentBook}
                    chapter={currentChapter}
                    verse={selectedVerse}
                    onReferenceClick={(book, chapter, verse) => {
                      setCurrentBook(book);
                      setCurrentChapter(chapter);
                      setSelectedVerse(verse);
                    }}
                  />
                </Suspense>
              </div>
            )}
          </div>
          {showCommentary && (
            <div className="w-1/3">
              <div
                className="rounded-lg shadow-sm p-6"
                style={{ backgroundColor: currentTheme.colors.surface }}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <LazyCommentary
                    book={currentBook}
                    chapter={currentChapter}
                    verse={selectedVerse || undefined}
                  />
                </Suspense>
              </div>
            </div>
          )}
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <LazyWordStudy word={selectedWord} onClose={() => setSelectedWord(null)} />
        </Suspense>
      </div>
    </MainLayout>
  );
};

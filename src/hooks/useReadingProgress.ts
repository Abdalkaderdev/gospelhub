import { useState, useEffect, useCallback } from 'react';

interface ReadingProgressData {
  progress: number;
  estimatedReadingTime: number;
  wordsRead: number;
  totalWords: number;
}

export const useReadingProgress = (containerRef: React.RefObject<HTMLElement>, text: string) => {
  const [progressData, setProgressData] = useState<ReadingProgressData>({
    progress: 0,
    estimatedReadingTime: 0,
    wordsRead: 0,
    totalWords: 0
  });

  const calculateReadingTime = useCallback((wordCount: number) => {
    const averageWPM = 200;
    return Math.ceil(wordCount / averageWPM);
  }, []);

  const getWordCount = useCallback((text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !text) return;

    const totalWords = getWordCount(text);
    const totalReadingTime = calculateReadingTime(totalWords);

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollableHeight = scrollHeight - clientHeight;
      
      if (scrollableHeight <= 0) {
        setProgressData({
          progress: 100,
          estimatedReadingTime: 0,
          wordsRead: totalWords,
          totalWords
        });
        return;
      }

      const scrollProgress = Math.min((scrollTop / scrollableHeight) * 100, 100);
      const wordsRead = Math.floor((scrollProgress / 100) * totalWords);
      const remainingWords = totalWords - wordsRead;
      const timeRemaining = calculateReadingTime(remainingWords);

      setProgressData({
        progress: scrollProgress,
        estimatedReadingTime: timeRemaining,
        wordsRead,
        totalWords
      });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef, text, calculateReadingTime, getWordCount]);

  return progressData;
};
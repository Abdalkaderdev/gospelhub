import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ReadingProgressBarProps {
  totalVerses: number;
  currentChapter: string;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  totalVerses,
  currentChapter
}) => {
  const { currentTheme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [currentVerse, setCurrentVerse] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min(scrollTop / docHeight, 1);
      
      setProgress(scrollPercent * 100);
      setCurrentVerse(Math.min(Math.ceil(scrollPercent * totalVerses) || 1, totalVerses));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalVerses]);

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm"
      style={{ 
        backgroundColor: currentTheme.colors.surface + 'F0',
        borderColor: currentTheme.colors.border 
      }}
    >
      <div className="h-1 w-full bg-gray-200 relative overflow-hidden">
        <div 
          className="h-full transition-all duration-150 ease-out"
          style={{ 
            width: `${progress}%`,
            backgroundColor: currentTheme.colors.primary 
          }}
        />
      </div>
      <div className="px-4 py-2 flex justify-between items-center text-sm">
        <span style={{ color: currentTheme.colors.textSecondary }}>
          {currentChapter}
        </span>
        <div className="flex items-center gap-3">
          <span style={{ color: currentTheme.colors.text }}>
            Verse {currentVerse} of {totalVerses}
          </span>
          <span 
            className="font-medium"
            style={{ color: currentTheme.colors.primary }}
          >
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};
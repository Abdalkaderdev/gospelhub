import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface Translation {
  id: string;
  name: string;
  data: any;
}

interface ParallelBibleViewProps {
  book: string;
  chapter: number;
  translations: Translation[];
  onAddTranslation: () => void;
  onRemoveTranslation: (id: string) => void;
}

export const ParallelBibleView: React.FC<ParallelBibleViewProps> = ({
  book, chapter, translations, onAddTranslation, onRemoveTranslation
}) => {
  const { currentTheme } = useTheme();
  const [syncScroll, setSyncScroll] = useState(true);
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  const getVerses = (translation: Translation) => {
    return translation.data?.data?.[book]?.verses?.[chapter] || [];
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!syncScroll) return;
    
    const scrollTop = e.currentTarget.scrollTop;
    const containers = document.querySelectorAll('.parallel-scroll');
    containers.forEach(container => {
      if (container !== e.currentTarget) {
        container.scrollTop = scrollTop;
      }
    });
  };

  const findDifferences = (verse1: string, verse2: string) => {
    const words1 = verse1.toLowerCase().split(/\s+/);
    const words2 = verse2.toLowerCase().split(/\s+/);
    const differences = [];
    
    for (let i = 0; i < Math.max(words1.length, words2.length); i++) {
      if (words1[i] !== words2[i]) {
        differences.push(i);
      }
    }
    return differences;
  };

  const highlightText = (text: string, differences: number[]) => {
    if (!highlightDifferences || differences.length === 0) return text;
    
    const words = text.split(/\s+/);
    return words.map((word, index) => 
      differences.includes(index) ? (
        <mark 
          key={index}
          className="px-1 rounded"
          style={{ 
            backgroundColor: currentTheme.colors.accent + '40',
            color: currentTheme.colors.text
          }}
        >
          {word}
        </mark>
      ) : word
    ).reduce((prev, curr, index) => [prev, ' ', curr]);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 rounded-lg border"
        style={{
          backgroundColor: currentTheme.colors.background,
          borderColor: currentTheme.colors.border
        }}
      >
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={syncScroll}
              onChange={(e) => setSyncScroll(e.target.checked)}
              className="rounded"
            />
            <span style={{ color: currentTheme.colors.text }}>Sync Scroll</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={highlightDifferences}
              onChange={(e) => setHighlightDifferences(e.target.checked)}
              className="rounded"
            />
            <span style={{ color: currentTheme.colors.text }}>Highlight Differences</span>
          </label>
        </div>
        
        <button
          onClick={onAddTranslation}
          className="px-3 py-1 text-sm rounded-lg border hover:opacity-80 transition-opacity"
          style={{
            backgroundColor: currentTheme.colors.primary,
            color: 'white',
            borderColor: currentTheme.colors.primary
          }}
        >
          + Add Translation
        </button>
      </div>

      {/* Parallel Columns */}
      <div 
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${translations.length}, 1fr)` }}
      >
        {translations.map((translation, index) => {
          const verses = getVerses(translation);
          const baseVerses = index === 0 ? verses : getVerses(translations[0]);
          
          return (
            <motion.div
              key={translation.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-lg border overflow-hidden"
              style={{
                backgroundColor: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border
              }}
            >
              {/* Header */}
              <div className="p-3 border-b flex items-center justify-between"
                style={{ borderColor: currentTheme.colors.border }}
              >
                <div>
                  <h3 className="font-medium text-sm" style={{ color: currentTheme.colors.text }}>
                    {translation.name}
                  </h3>
                  <div className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                    {book} {chapter}
                  </div>
                </div>
                {translations.length > 1 && (
                  <button
                    onClick={() => onRemoveTranslation(translation.id)}
                    className="text-xs hover:opacity-70 transition-opacity"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Verses */}
              <div 
                className="parallel-scroll max-h-96 overflow-y-auto p-3 space-y-2"
                onScroll={handleScroll}
              >
                {verses.map((verseData: any, verseIndex: number) => {
                  const differences = index > 0 && baseVerses[verseIndex] 
                    ? findDifferences(baseVerses[verseIndex].text, verseData.text)
                    : [];
                  
                  return (
                    <div key={verseIndex} className="flex gap-3">
                      <span 
                        className="flex-shrink-0 font-medium text-sm w-8"
                        style={{ color: currentTheme.colors.primary }}
                      >
                        {verseIndex + 1}
                      </span>
                      <div className="text-sm leading-relaxed" style={{ color: currentTheme.colors.text }}>
                        {highlightText(verseData.text, differences)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
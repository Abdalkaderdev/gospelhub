import React, { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { getStrongsNumber, isHebrewStrongs } from '../../data/wordMappings';
import strongsHebrew from '../../data/strongsHebrew.json';
import strongsGreek from '../../data/strongsGreek.json';

interface StrongsEntry {
  strongs: string;
  transliteration: string;
  pronunciation: string;
  definition: string;
  rootWord: string;
}

interface WordStudyTooltipProps {
  word: string;
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
}

export const WordStudyTooltip = memo<WordStudyTooltipProps>(({
  word,
  isVisible,
  position,
  onClose
}) => {
  const { currentTheme } = useTheme();
  const [entry, setEntry] = useState<StrongsEntry | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    const strongsNumber = getStrongsNumber(word);
    if (!strongsNumber) {
      setEntry(null);
      return;
    }

    const isHebrew = isHebrewStrongs(strongsNumber);
    const data = isHebrew ? strongsHebrew : strongsGreek;
    const foundEntry = data.find(item => item.strongs === strongsNumber);
    
    setEntry(foundEntry || null);
  }, [word, isVisible]);

  if (!entry || !isVisible) return null;

  const isHebrew = isHebrewStrongs(entry.strongs);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed z-50 pointer-events-none"
        style={{
          left: position.x,
          top: position.y - 10,
          transform: 'translateX(-50%)'
        }}
      >
        <div
          className="max-w-xs p-3 rounded-lg shadow-lg border"
          style={{
            backgroundColor: currentTheme.colors.surface,
            borderColor: currentTheme.colors.border,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="px-2 py-1 rounded text-xs font-mono"
              style={{
                backgroundColor: isHebrew ? '#3b82f6' : '#ef4444',
                color: 'white'
              }}
            >
              {entry.strongs}
            </span>
            <span
              className="text-xs font-medium"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              {isHebrew ? 'Hebrew' : 'Greek'}
            </span>
          </div>

          {/* Transliteration */}
          <div className="mb-2">
            <span
              className="text-sm font-medium italic"
              style={{ color: currentTheme.colors.text }}
            >
              {entry.transliteration}
            </span>
            <span
              className="text-xs ml-2"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              [{entry.pronunciation}]
            </span>
          </div>

          {/* Definition */}
          <p
            className="text-sm"
            style={{ color: currentTheme.colors.text }}
          >
            {entry.definition}
          </p>

          {/* Arrow */}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: `6px solid ${currentTheme.colors.border}`
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

WordStudyTooltip.displayName = 'WordStudyTooltip';
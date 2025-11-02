import React, { memo, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { getStrongsNumber, isHebrewStrongs } from '../../data/wordMappings';
import { WordStudyTooltip } from './WordStudyTooltip';
import { WordStudyPanel } from './WordStudyPanel';

interface EnhancedVerseTextProps {
  text: string;
  verseNumber: number;
  className?: string;
}

interface WordState {
  word: string;
  isHovered: boolean;
  position: { x: number; y: number };
}

export const EnhancedVerseText = memo<EnhancedVerseTextProps>(({
  text,
  verseNumber,
  className = ''
}) => {
  const { currentTheme } = useTheme();
  const [hoveredWord, setHoveredWord] = useState<WordState | null>(null);
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [showPanel, setShowPanel] = useState(false);
  const containerRef = useRef<HTMLParagraphElement>(null);

  const handleWordHover = useCallback((word: string, event: React.MouseEvent) => {
    const strongsNumber = getStrongsNumber(word);
    if (!strongsNumber) return;

    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredWord({
      word,
      isHovered: true,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top
      }
    });
  }, []);

  const handleWordLeave = useCallback(() => {
    setHoveredWord(null);
  }, []);

  const handleWordClick = useCallback((word: string) => {
    const strongsNumber = getStrongsNumber(word);
    if (!strongsNumber) return;

    setSelectedWord(word);
    setShowPanel(true);
    setHoveredWord(null);
  }, []);

  const renderWord = useCallback((word: string, index: number) => {
    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
    const strongsNumber = getStrongsNumber(cleanWord);
    const hasStrongs = !!strongsNumber;
    const isHebrew = strongsNumber ? isHebrewStrongs(strongsNumber) : false;

    if (!hasStrongs) {
      return (
        <span key={index} className="mr-1">
          {word}
        </span>
      );
    }

    return (
      <motion.span
        key={index}
        className="mr-1 cursor-pointer relative inline-block"
        style={{
          borderBottom: `2px dotted ${isHebrew ? '#3b82f6' : '#ef4444'}`,
          borderBottomWidth: '1px'
        }}
        onMouseEnter={(e) => handleWordHover(cleanWord, e)}
        onMouseLeave={handleWordLeave}
        onClick={() => handleWordClick(cleanWord)}
        whileHover={{
          color: isHebrew ? '#3b82f6' : '#ef4444',
          scale: 1.05
        }}
        transition={{ duration: 0.2 }}
      >
        {word}
      </motion.span>
    );
  }, [handleWordHover, handleWordLeave, handleWordClick]);

  const words = text.split(' ');

  return (
    <>
      <motion.p
        ref={containerRef}
        className={`text-base leading-relaxed ${className}`}
        style={{ color: currentTheme.colors.text }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: verseNumber * 0.05 }}
      >
        <span 
          className="text-sm font-semibold mr-3 inline-block min-w-8"
          style={{ color: currentTheme.colors.primary }}
        >
          {verseNumber}
        </span>
        {words.map((word, index) => renderWord(word, index))}
      </motion.p>

      {/* Tooltip */}
      {hoveredWord && (
        <WordStudyTooltip
          word={hoveredWord.word}
          isVisible={hoveredWord.isHovered}
          position={hoveredWord.position}
          onClose={() => setHoveredWord(null)}
        />
      )}

      {/* Expanded Panel */}
      <WordStudyPanel
        word={selectedWord}
        isOpen={showPanel}
        onClose={() => setShowPanel(false)}
      />
    </>
  );
});

EnhancedVerseText.displayName = 'EnhancedVerseText';
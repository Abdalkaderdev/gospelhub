import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BibleVerse } from '../types';
import { triggerHaptic, isMobileDevice } from '../utils/haptics';
import { EnhancedVerseText } from './study/EnhancedVerseText';

interface VerseListProps {
  verses: BibleVerse[];
  onWordClick: (word: string) => void;
  currentTheme: any;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const verseVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export const VerseList = memo<VerseListProps>(({ verses, onWordClick, currentTheme }) => {
  return (
    <motion.div
      className="space-y-3 sm:space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {verses.map((verse, index) => (
        <motion.div
          key={`${verse.book}-${verse.chapter}-${verse.verse}`}
          variants={verseVariants}
          className="rounded-xl border p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
          style={{
            borderColor: currentTheme.colors.border,
            backgroundColor: currentTheme.colors.background
          }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          <span 
            className="text-xs sm:text-sm font-medium block mb-2" 
            style={{ color: currentTheme.colors.primary }}
          >
            {verse.book} {verse.chapter}:{verse.verse}
          </span>
          
          <EnhancedVerseText
            text={verse.text}
            verseNumber={verse.verse}
            className="text-sm sm:text-base leading-relaxed"
          />
        </motion.div>
      ))}
    </motion.div>
  );
});

VerseList.displayName = 'VerseList';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import strongsGreek from '../data/strongsGreek';
import strongsHebrew from '../data/strongsHebrew';

interface StrongsData {
  strongs: string;
  transliteration: string;
  pronunciation: string;
  definition: string;
  rootWord: string;
}

interface WordStudyTooltipProps {
  word: string;
  children: React.ReactNode;
  testament?: 'old' | 'new';
}

const wordToStrongs: Record<string, string> = {
  'God': 'G2316',
  'love': 'G26',
  'world': 'G2889',
  'only': 'G3439',
  'begotten': 'G3439',
  'Son': 'G5207',
  'believe': 'G4100',
  'life': 'G2222',
  'eternal': 'G166',
  'Word': 'G3056',
  'light': 'G5457',
  'beginning': 'H7225',
  'created': 'H1254',
  'heaven': 'H8064',
  'earth': 'H776',
  'LORD': 'H3068',
  'king': 'H4428'
};

export const WordStudyTooltip: React.FC<WordStudyTooltipProps> = ({
  word,
  children,
  testament = 'new'
}) => {
  const { currentTheme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showExpanded, setShowExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const wordRef = useRef<HTMLSpanElement>(null);

  const strongsNumber = wordToStrongs[word.toLowerCase()];
  const strongsData = strongsNumber 
    ? [...strongsGreek, ...strongsHebrew].find(item => item.strongs === strongsNumber)
    : null;

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!strongsData) return;
    
    const rect = wordRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    if (!showExpanded) {
      setShowTooltip(false);
    }
  };

  const handleClick = () => {
    if (strongsData) {
      setShowExpanded(true);
    }
  };

  if (!strongsData) {
    return <>{children}</>;
  }

  const isGreek = strongsData.strongs.startsWith('G');

  return (
    <>
      <span
        ref={wordRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="cursor-pointer hover:underline transition-all duration-200"
        style={{ 
          color: currentTheme.colors.primary,
          textDecorationColor: currentTheme.colors.primary + '60'
        }}
      >
        {children}
      </span>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed z-50 px-3 py-2 rounded-lg shadow-lg border text-sm max-w-xs"
            style={{
              left: position.x - 100,
              top: position.y - 60,
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.border,
              color: currentTheme.colors.text
            }}
          >
            <div className="font-medium mb-1">
              {strongsData.transliteration}
              <span className="ml-2 text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                {strongsData.strongs}
              </span>
            </div>
            <div className="text-xs mb-1" style={{ color: currentTheme.colors.textSecondary }}>
              /{strongsData.pronunciation}/
            </div>
            <div className="text-xs">{strongsData.definition}</div>
            <div className="text-xs mt-1 opacity-60">Click for details</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
              style={{
                backgroundColor: currentTheme.colors.surface,
                border: `1px solid ${currentTheme.colors.border}`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b" style={{ borderColor: currentTheme.colors.border }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold" style={{ color: currentTheme.colors.text }}>
                    Word Study
                  </h3>
                  <button
                    onClick={() => setShowExpanded(false)}
                    className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <div className="text-2xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
                    {strongsData.transliteration}
                  </div>
                  <div className="text-sm mb-2" style={{ color: currentTheme.colors.textSecondary }}>
                    {isGreek ? 'Greek' : 'Hebrew'} • {strongsData.strongs}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                    Pronunciation
                  </div>
                  <div className="text-lg font-mono" style={{ color: currentTheme.colors.textSecondary }}>
                    /{strongsData.pronunciation}/
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                    Definition
                  </div>
                  <div className="text-base leading-relaxed" style={{ color: currentTheme.colors.text }}>
                    {strongsData.definition}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                    Root Word
                  </div>
                  <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                    {strongsData.rootWord}
                  </div>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: currentTheme.colors.border }}>
                  <div className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                    Strong's Concordance • {isGreek ? 'New Testament Greek' : 'Old Testament Hebrew'}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
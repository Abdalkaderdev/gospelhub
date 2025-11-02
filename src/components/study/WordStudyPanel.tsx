import React, { memo, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, BookOpen, Search } from 'lucide-react';
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

interface WordStudyPanelProps {
  word: string;
  isOpen: boolean;
  onClose: () => void;
}

export const WordStudyPanel = memo<WordStudyPanelProps>(({
  word,
  isOpen,
  onClose
}) => {
  const { currentTheme } = useTheme();
  const [entry, setEntry] = useState<StrongsEntry | null>(null);
  const [relatedWords, setRelatedWords] = useState<StrongsEntry[]>([]);

  const allData = useMemo(() => [...strongsHebrew, ...strongsGreek], []);

  useEffect(() => {
    if (!isOpen || !word) return;

    const strongsNumber = getStrongsNumber(word);
    if (!strongsNumber) {
      setEntry(null);
      setRelatedWords([]);
      return;
    }

    const foundEntry = allData.find(item => item.strongs === strongsNumber);
    setEntry(foundEntry || null);

    if (foundEntry) {
      // Find related words with same root
      const related = allData.filter(item => 
        item.rootWord === foundEntry.rootWord && 
        item.strongs !== foundEntry.strongs
      ).slice(0, 5);
      setRelatedWords(related);
    }
  }, [word, isOpen, allData]);

  const handlePlayPronunciation = () => {
    if (entry && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(entry.pronunciation);
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  if (!entry) return null;

  const isHebrew = isHebrewStrongs(entry.strongs);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[70vh] overflow-hidden rounded-t-2xl shadow-2xl"
            style={{
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.border
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b" 
              style={{ borderColor: currentTheme.colors.border }}>
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
                <h3 className="text-lg font-semibold" style={{ color: currentTheme.colors.text }}>
                  Word Study: {word}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(70vh-80px)]">
              {/* Main Entry */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="px-3 py-1 rounded-full text-sm font-mono font-medium"
                    style={{
                      backgroundColor: isHebrew ? '#3b82f6' : '#ef4444',
                      color: 'white'
                    }}
                  >
                    {entry.strongs}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    {isHebrew ? 'Hebrew' : 'Greek'}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-semibold" style={{ color: currentTheme.colors.text }}>
                      {entry.transliteration}
                    </h4>
                    <button
                      onClick={handlePlayPronunciation}
                      className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                      style={{ color: currentTheme.colors.primary }}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm italic mb-3" style={{ color: currentTheme.colors.textSecondary }}>
                    [{entry.pronunciation}]
                  </p>
                  <p className="text-base leading-relaxed" style={{ color: currentTheme.colors.text }}>
                    {entry.definition}
                  </p>
                </div>

                {/* Root Word */}
                <div className="p-3 rounded-lg" style={{ backgroundColor: currentTheme.colors.background }}>
                  <h5 className="text-sm font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                    Root Word
                  </h5>
                  <span
                    className="text-sm font-mono"
                    style={{ color: currentTheme.colors.primary }}
                  >
                    {entry.rootWord}
                  </span>
                </div>
              </div>

              {/* Related Words */}
              {relatedWords.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold mb-3" style={{ color: currentTheme.colors.text }}>
                    Related Words
                  </h4>
                  <div className="space-y-3">
                    {relatedWords.map((related) => (
                      <motion.div
                        key={related.strongs}
                        className="p-3 rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          borderColor: currentTheme.colors.border,
                          backgroundColor: currentTheme.colors.background
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="px-2 py-1 rounded text-xs font-mono"
                            style={{
                              backgroundColor: isHebrewStrongs(related.strongs) ? '#3b82f620' : '#ef444420',
                              color: isHebrewStrongs(related.strongs) ? '#3b82f6' : '#ef4444'
                            }}
                          >
                            {related.strongs}
                          </span>
                          <span className="font-medium text-sm" style={{ color: currentTheme.colors.text }}>
                            {related.transliteration}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                          {related.definition}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Usage Examples */}
              <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: currentTheme.colors.background }}>
                <h5 className="text-sm font-medium mb-2" style={{ color: currentTheme.colors.text }}>
                  Study Tips
                </h5>
                <ul className="text-sm space-y-1" style={{ color: currentTheme.colors.textSecondary }}>
                  <li>• Compare with related words from the same root</li>
                  <li>• Look for this word in other Bible passages</li>
                  <li>• Consider the cultural and historical context</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

WordStudyPanel.displayName = 'WordStudyPanel';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WordStudy as WordStudyType } from '../../types';
import { studyService } from '../../study';

interface WordStudyProps {
  word: string | null;
  onClose: () => void;
}

export const WordStudy = ({ word, onClose }: WordStudyProps) => {
  const [study, setStudy] = useState<WordStudyType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!word) return;
    
    const loadStudy = async () => {
      setLoading(true);
      try {
        const result = await studyService.getWordStudy(word);
        setStudy(result);
      } catch (error) {
        console.error('Failed to load word study:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStudy();
  }, [word]);

  if (!word) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-2xl bg-[var(--color-surface)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-light text-[var(--color-text)]">Word Study</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[var(--color-border)] transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-6 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <motion.div
                  className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : study ? (
              <div className="space-y-6">
                {/* Word Header */}
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-bold text-[var(--color-primary)]">{study.word}</h3>
                  <div className="flex items-center justify-center gap-4 text-sm text-[var(--color-text-secondary)]">
                    <span className="font-mono bg-[var(--color-background)] px-2 py-1 rounded">
                      {study.original}
                    </span>
                    <span className="italic">{study.transliteration}</span>
                    <span className="bg-[var(--color-primary)] text-white px-2 py-1 rounded text-xs">
                      {study.strongsNumber}
                    </span>
                  </div>
                </div>

                {/* Definition */}
                <motion.div
                  className="p-4 bg-[var(--color-background)] rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="font-semibold text-[var(--color-text)] mb-2">Definition</h4>
                  <p className="text-[var(--color-text-secondary)]">{study.definition}</p>
                </motion.div>

                {/* Etymology */}
                <motion.div
                  className="p-4 bg-[var(--color-background)] rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="font-semibold text-[var(--color-text)] mb-2">Etymology</h4>
                  <p className="text-[var(--color-text-secondary)]">{study.etymology}</p>
                </motion.div>

                {/* Usage Examples */}
                <motion.div
                  className="p-4 bg-[var(--color-background)] rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="font-semibold text-[var(--color-text)] mb-2">Key Usage</h4>
                  <div className="flex flex-wrap gap-2">
                    {study.usage.map((ref, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[var(--color-primary)] text-white rounded-full text-sm"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--color-text-secondary)]">
                No study data available for "{word}"
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BibleVerse, ParallelView as ParallelViewType } from '../../types';
import { bibleTranslations } from '../../data';

interface ParallelViewProps {
  book: string;
  chapter: number;
  config: ParallelViewType;
  onConfigChange: (config: ParallelViewType) => void;
}

export const ParallelView = ({ book, chapter, config, onConfigChange }: ParallelViewProps) => {
  const [verses, setVerses] = useState<{ [translation: string]: BibleVerse[] }>({});
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const loadVerses = () => {
      const newVerses: { [translation: string]: BibleVerse[] } = {};
      config.translations.forEach(translationId => {
        const translation = bibleTranslations.find(t => t.id === translationId);
        if (translation?.data[book]?.verses[chapter]) {
          newVerses[translationId] = translation.data[book].verses[chapter];
        }
      });
      setVerses(newVerses);
    };
    loadVerses();
  }, [book, chapter, config.translations]);

  const handleScroll = (translationId: string, e: React.UIEvent<HTMLDivElement>) => {
    if (!config.syncScroll) return;
    
    const scrollTop = e.currentTarget.scrollTop;
    Object.keys(scrollRefs.current).forEach(id => {
      if (id !== translationId && scrollRefs.current[id]) {
        scrollRefs.current[id]!.scrollTop = scrollTop;
      }
    });
  };

  const addTranslation = (translationId: string) => {
    if (!config.translations.includes(translationId)) {
      onConfigChange({
        ...config,
        translations: [...config.translations, translationId]
      });
    }
  };

  const removeTranslation = (translationId: string) => {
    if (config.translations.length > 1) {
      onConfigChange({
        ...config,
        translations: config.translations.filter(id => id !== translationId)
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={config.syncScroll}
              onChange={(e) => onConfigChange({ ...config, syncScroll: e.target.checked })}
              className="rounded"
            />
            Sync Scroll
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={config.highlightDifferences}
              onChange={(e) => onConfigChange({ ...config, highlightDifferences: e.target.checked })}
              className="rounded"
            />
            Highlight Differences
          </label>
        </div>
        
        <select
          onChange={(e) => addTranslation(e.target.value)}
          value=""
          className="px-3 py-1 rounded border border-[var(--color-border)] text-sm"
        >
          <option value="">Add Translation</option>
          {bibleTranslations
            .filter(t => !config.translations.includes(t.id))
            .map(t => (
              <option key={t.id} value={t.id}>{t.abbreviation}</option>
            ))}
        </select>
      </div>

      {/* Parallel Columns */}
      <div className={`grid gap-4 ${config.translations.length === 2 ? 'grid-cols-2' : config.translations.length === 3 ? 'grid-cols-3' : 'grid-cols-1'}`}>
        {config.translations.map(translationId => {
          const translation = bibleTranslations.find(t => t.id === translationId);
          const translationVerses = verses[translationId] || [];
          
          return (
            <motion.div
              key={translationId}
              className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
                <h3 className="font-medium text-[var(--color-text)]">
                  {translation?.name} ({translation?.abbreviation})
                </h3>
                {config.translations.length > 1 && (
                  <button
                    onClick={() => removeTranslation(translationId)}
                    className="text-[var(--color-text-secondary)] hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <div
                ref={el => scrollRefs.current[translationId] = el}
                onScroll={(e) => handleScroll(translationId, e)}
                className="max-h-96 overflow-y-auto p-4 space-y-3"
              >
                {translationVerses.map(verse => (
                  <div key={verse.verse} className="flex gap-3">
                    <span className="text-[var(--color-primary)] font-medium text-sm min-w-[2rem]">
                      {verse.verse}
                    </span>
                    <p className="text-[var(--color-text)] text-sm leading-relaxed">
                      {verse.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
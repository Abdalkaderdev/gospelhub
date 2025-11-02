import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BibleVerse, ParallelView as ParallelViewType } from '../../types';
import { bibleTranslations, getAllTranslations } from '../../data';
import { useTheme } from '../../contexts/ThemeContext';

interface ParallelViewProps {
  book: string;
  chapter: number;
  config: ParallelViewType;
  onConfigChange: (config: ParallelViewType) => void;
}

interface VerseComparison {
  verseNumber: number;
  versions: { [translationId: string]: { text: string } };
}

export const ParallelViewEnhanced = ({ book, chapter, config, onConfigChange }: ParallelViewProps) => {
  const [verseComparisons, setVerseComparisons] = useState<VerseComparison[]>([]);
  const { currentTheme } = useTheme();
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isScrolling = useRef(false);

  useEffect(() => {
    const loadVerses = () => {
      const versesData: { [translation: string]: BibleVerse[] } = {};
      
      config.translations.forEach(translationId => {
        const translation = bibleTranslations.find(t => t.id === translationId);
        if (translation?.data[book]?.verses[chapter]) {
          versesData[translationId] = translation.data[book].verses[chapter];
        }
      });
      
      const maxVerses = Math.max(...Object.values(versesData).map(verses => verses.length));
      const comparisons: VerseComparison[] = [];
      
      for (let i = 0; i < maxVerses; i++) {
        const verseNumber = i + 1;
        const versions: { [translationId: string]: { text: string } } = {};
        
        config.translations.forEach(translationId => {
          const verse = versesData[translationId]?.[i];
          if (verse) {
            versions[translationId] = { text: verse.text };
          }
        });
        
        comparisons.push({ verseNumber, versions });
      }
      
      setVerseComparisons(comparisons);
    };
    
    loadVerses();
  }, [book, chapter, config.translations]);

  const handleScroll = useCallback((translationId: string, event: React.UIEvent<HTMLDivElement>) => {
    if (!config.syncScroll || isScrolling.current) return;
    
    isScrolling.current = true;
    const scrollTop = event.currentTarget.scrollTop;
    
    Object.keys(scrollRefs.current).forEach(id => {
      if (id !== translationId && scrollRefs.current[id]) {
        scrollRefs.current[id]!.scrollTop = scrollTop;
      }
    });
    
    setTimeout(() => {
      isScrolling.current = false;
    }, 100);
  }, [config.syncScroll]);

  const addTranslation = (translationId: string) => {
    if (!config.translations.includes(translationId) && config.translations.length < 3) {
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
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl border" style={{
        backgroundColor: currentTheme.colors.surface,
        borderColor: currentTheme.colors.border
      }}>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm" style={{ color: currentTheme.colors.text }}>
            <input
              type="checkbox"
              checked={config.syncScroll}
              onChange={(e) => onConfigChange({ ...config, syncScroll: e.target.checked })}
              className="rounded"
            />
            Sync Scroll
          </label>
          <label className="flex items-center gap-2 text-sm" style={{ color: currentTheme.colors.text }}>
            <input
              type="checkbox"
              checked={config.highlightDifferences}
              onChange={(e) => onConfigChange({ ...config, highlightDifferences: e.target.checked })}
              className="rounded"
              disabled={config.translations.length !== 2}
            />
            Highlight Differences
          </label>
        </div>
        
        <select
          onChange={(e) => addTranslation(e.target.value)}
          value=""
          className="px-3 py-1 rounded border text-sm"
          style={{
            borderColor: currentTheme.colors.border,
            backgroundColor: currentTheme.colors.background,
            color: currentTheme.colors.text
          }}
          disabled={config.translations.length >= 3}
        >
          <option value="">Add Translation</option>
          {getAllTranslations()
            .filter(t => !config.translations.includes(t.id))
            .map(t => (
              <option key={t.id} value={t.id}>{t.abbreviation}</option>
            ))}
        </select>
      </div>

      <div 
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${Math.min(config.translations.length, window.innerWidth < 768 ? 1 : config.translations.length)}, 1fr)`
        }}
      >
        {config.translations.map(translationId => {
          const translation = bibleTranslations.find(t => t.id === translationId);
          
          return (
            <motion.div
              key={translationId}
              className="rounded-xl border overflow-hidden"
              style={{
                backgroundColor: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: currentTheme.colors.border }}>
                <h3 className="font-medium text-sm" style={{ color: currentTheme.colors.text }}>
                  {translation?.abbreviation}
                </h3>
                {config.translations.length > 1 && (
                  <button
                    onClick={() => removeTranslation(translationId)}
                    className="hover:text-red-500 transition-colors text-sm"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <div 
                ref={el => scrollRefs.current[translationId] = el}
                className="h-96 overflow-y-auto"
                onScroll={(e) => handleScroll(translationId, e)}
              >
                {verseComparisons.map(comparison => {
                  const versionData = comparison.versions[translationId];
                  
                  return (
                    <div key={comparison.verseNumber} className="p-3 border-b" style={{ borderColor: currentTheme.colors.border }}>
                      <div className="flex items-start gap-3">
                        <span className="font-medium text-sm min-w-[2rem] mt-1" style={{ color: currentTheme.colors.primary }}>
                          {comparison.verseNumber}
                        </span>
                        <p className="text-sm leading-relaxed flex-1" style={{ color: currentTheme.colors.text }}>
                          {versionData?.text || `Verse ${comparison.verseNumber} not available`}
                        </p>
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
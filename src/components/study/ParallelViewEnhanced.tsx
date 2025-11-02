import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AutoSizer, List, ListRowProps } from 'react-virtualized';
import { BibleVerse, ParallelView as ParallelViewType } from '../../types';
import { bibleTranslations } from '../../data';
import { compareTexts, TextDifference } from '../../utils/textComparison';

interface ParallelViewProps {
  book: string;
  chapter: number;
  config: ParallelViewType;
  onConfigChange: (config: ParallelViewType) => void;
}

interface VerseComparison {
  verseNumber: number;
  versions: { [translationId: string]: { text: string; diffs?: TextDifference[] } };
}

export const ParallelViewEnhanced = ({ book, chapter, config, onConfigChange }: ParallelViewProps) => {
  const [verseComparisons, setVerseComparisons] = useState<VerseComparison[]>([]);
  const listRefs = useRef<{ [key: string]: List | null }>({});
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
        const versions: { [translationId: string]: { text: string; diffs?: TextDifference[] } } = {};
        
        config.translations.forEach(translationId => {
          const verse = versesData[translationId]?.[i];
          if (verse) {
            versions[translationId] = { text: verse.text };
          }
        });
        
        if (config.highlightDifferences && config.translations.length === 2) {
          const [trans1, trans2] = config.translations;
          const text1 = versions[trans1]?.text || '';
          const text2 = versions[trans2]?.text || '';
          
          if (text1 && text2) {
            const { text1Diffs, text2Diffs } = compareTexts(text1, text2);
            versions[trans1].diffs = text1Diffs;
            versions[trans2].diffs = text2Diffs;
          }
        }
        
        comparisons.push({ verseNumber, versions });
      }
      
      setVerseComparisons(comparisons);
    };
    
    loadVerses();
  }, [book, chapter, config.translations, config.highlightDifferences]);

  const handleScroll = useCallback((translationId: string, { scrollTop }: { scrollTop: number }) => {
    if (!config.syncScroll || isScrolling.current) return;
    
    isScrolling.current = true;
    
    Object.keys(listRefs.current).forEach(id => {
      if (id !== translationId && listRefs.current[id]) {
        listRefs.current[id]!.scrollToPosition(scrollTop);
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

  const renderDiffText = (diffs: TextDifference[]) => {
    return diffs.map((diff, index) => {
      let className = '';
      if (diff.type === 'added') className = 'bg-green-100 text-green-800 px-1 rounded';
      if (diff.type === 'removed') className = 'bg-red-100 text-red-800 px-1 rounded';
      
      return (
        <span key={index} className={className}>
          {diff.text}{' '}
        </span>
      );
    });
  };

  const renderVerseRow = ({ index, key, style }: ListRowProps, translationId: string) => {
    const comparison = verseComparisons[index];
    const versionData = comparison?.versions[translationId];
    
    if (!versionData) {
      return (
        <div key={key} style={{...style, borderColor: 'var(--color-border)'}} className="p-3 border-b">
          <div className="text-gray-400 text-sm">Verse {comparison?.verseNumber}</div>
        </div>
      );
    }
    
    return (
      <div key={key} style={{...style, borderColor: 'var(--color-border)'}} className="p-3 border-b">
        <div className="flex items-start gap-3">
          <span className="font-medium text-sm min-w-[2rem] mt-1" style={{ color: 'var(--color-primary)' }}>
            {comparison.verseNumber}
          </span>
          <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--color-text)' }}>
            {versionData.diffs ? renderDiffText(versionData.diffs) : versionData.text}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
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
              disabled={config.translations.length !== 2}
            />
            Highlight Differences
          </label>
        </div>
        
        <select
          onChange={(e) => addTranslation(e.target.value)}
          value=""
          className="px-3 py-1 rounded border border-[var(--color-border)] text-sm"
          disabled={config.translations.length >= 3}
        >
          <option value="">Add Translation</option>
          {bibleTranslations
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
              className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
                <h3 className="font-medium text-[var(--color-text)] text-sm">
                  {translation?.abbreviation}
                </h3>
                {config.translations.length > 1 && (
                  <button
                    onClick={() => removeTranslation(translationId)}
                    className="text-[var(--color-text-secondary)] hover:text-red-500 transition-colors text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <div className="h-96">
                <AutoSizer>
                  {({ height, width }) => (
                    <List
                      ref={el => listRefs.current[translationId] = el}
                      height={height}
                      width={width}
                      rowCount={verseComparisons.length}
                      rowHeight={80}
                      rowRenderer={(props) => renderVerseRow(props, translationId)}
                      onScroll={({ scrollTop }) => handleScroll(translationId, { scrollTop })}
                    />
                  )}
                </AutoSizer>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
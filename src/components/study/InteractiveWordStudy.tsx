import React, { memo, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Volume2, ExternalLink } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { StrongsEntry, getStrongsEntry, searchStrongs } from '../../data/strongs';

interface InteractiveWordStudyProps {
  word: string;
  strongsNumber?: string;
  onClose: () => void;
}

const StrongsCard = memo<{ entry: StrongsEntry; isExpanded: boolean; onToggle: () => void }>(
  ({ entry, isExpanded, onToggle }) => {
    const { currentTheme } = useTheme();

    return (
      <motion.div
        className="border rounded-xl p-4 cursor-pointer"
        style={{
          borderColor: currentTheme.colors.border,
          backgroundColor: currentTheme.colors.surface
        }}
        onClick={onToggle}
        whileHover={{ scale: 1.02 }}
        layout
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span 
              className="px-2 py-1 rounded text-xs font-mono"
              style={{ 
                backgroundColor: currentTheme.colors.primary + '20',
                color: currentTheme.colors.primary 
              }}
            >
              {entry.number}
            </span>
            <span 
              className="text-lg font-semibold"
              style={{ color: currentTheme.colors.text }}
            >
              {entry.word}
            </span>
          </div>
          <Volume2 className="w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
        </div>

        <div className="mb-2">
          <span 
            className="text-sm italic"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            {entry.transliteration} ({entry.pronunciation})
          </span>
        </div>

        <p 
          className="text-sm mb-3"
          style={{ color: currentTheme.colors.text }}
        >
          {entry.definition}
        </p>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-3 pt-3 border-t" style={{ borderColor: currentTheme.colors.border }}>
                <div>
                  <h4 className="text-sm font-semibold mb-1" style={{ color: currentTheme.colors.text }}>
                    Etymology
                  </h4>
                  <p className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                    {entry.etymology}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
                    Usage
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {entry.usage.map((usage, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: currentTheme.colors.accent + '20',
                          color: currentTheme.colors.accent
                        }}
                      >
                        {usage}
                      </span>
                    ))}
                  </div>
                </div>

                {entry.relatedWords.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
                      Related Words
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {entry.relatedWords.map((related, index) => (
                        <button
                          key={index}
                          className="px-2 py-1 rounded text-xs hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor: currentTheme.colors.secondary + '20',
                            color: currentTheme.colors.secondary
                          }}
                        >
                          {related}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

StrongsCard.displayName = 'StrongsCard';

export const InteractiveWordStudy = memo<InteractiveWordStudyProps>(({ 
  word, 
  strongsNumber, 
  onClose 
}) => {
  const { currentTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState(word);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const strongsEntry = useMemo(() => {
    return strongsNumber ? getStrongsEntry(strongsNumber) : null;
  }, [strongsNumber]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchStrongs(searchQuery).slice(0, 5);
  }, [searchQuery]);

  const handleCardToggle = useCallback((number: string) => {
    setExpandedCard(prev => prev === number ? null : number);
  }, []);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: currentTheme.colors.surface,
            border: `1px solid ${currentTheme.colors.border}`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b" style={{ borderColor: currentTheme.colors.border }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
                <h2 className="text-xl font-semibold" style={{ color: currentTheme.colors.text }}>
                  Word Study: {word}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                ✕
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                style={{ color: currentTheme.colors.textSecondary }} />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search Strong's concordance..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border"
                style={{
                  borderColor: currentTheme.colors.border,
                  backgroundColor: currentTheme.colors.background,
                  color: currentTheme.colors.text
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {/* Primary Strong's Entry */}
              {strongsEntry && (
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: currentTheme.colors.text }}>
                    Primary Entry
                  </h3>
                  <StrongsCard
                    entry={strongsEntry}
                    isExpanded={expandedCard === strongsEntry.number}
                    onToggle={() => handleCardToggle(strongsEntry.number)}
                  />
                </div>
              )}

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: currentTheme.colors.text }}>
                    Related Entries
                  </h3>
                  <div className="space-y-3">
                    {searchResults.map((entry) => (
                      <StrongsCard
                        key={entry.number}
                        entry={entry}
                        isExpanded={expandedCard === entry.number}
                        onToggle={() => handleCardToggle(entry.number)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* External Resources */}
              <div className="pt-4 border-t" style={{ borderColor: currentTheme.colors.border }}>
                <h3 className="text-lg font-semibold mb-3" style={{ color: currentTheme.colors.text }}>
                  External Resources
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className="flex items-center gap-2 p-3 rounded-lg border hover:opacity-80 transition-opacity"
                    style={{
                      borderColor: currentTheme.colors.border,
                      backgroundColor: currentTheme.colors.background
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">Blue Letter Bible</span>
                  </button>
                  <button
                    className="flex items-center gap-2 p-3 rounded-lg border hover:opacity-80 transition-opacity"
                    style={{
                      borderColor: currentTheme.colors.border,
                      backgroundColor: currentTheme.colors.background
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">Bible Hub</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

InteractiveWordStudy.displayName = 'InteractiveWordStudy';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface CrossReference {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  connection: string;
}

interface Character {
  name: string;
  description: string;
  keyVerses: string[];
  significance: string;
}

interface ThematicStudy {
  theme: string;
  description: string;
  verses: Array<{
    book: string;
    chapter: number;
    verse: number;
    text: string;
    context: string;
  }>;
}

const crossReferences: Record<string, CrossReference[]> = {
  'John-3-16': [
    { book: 'Romans', chapter: 5, verse: 8, text: 'But God demonstrates his own love for us...', connection: 'God\'s love' },
    { book: '1 John', chapter: 4, verse: 9, text: 'This is how God showed his love among us...', connection: 'God\'s love manifested' },
    { book: 'Romans', chapter: 6, verse: 23, text: 'For the wages of sin is death, but the gift of God...', connection: 'Eternal life' }
  ]
};

const characters: Character[] = [
  {
    name: 'David',
    description: 'King of Israel, man after God\'s own heart, psalmist',
    keyVerses: ['1 Samuel 16:7', 'Psalm 23:1', 'Acts 13:22'],
    significance: 'Model of faith, repentance, and worship'
  },
  {
    name: 'Moses',
    description: 'Prophet and lawgiver who led Israel out of Egypt',
    keyVerses: ['Exodus 3:14', 'Deuteronomy 34:10', 'Hebrews 11:24-26'],
    significance: 'Mediator between God and Israel, deliverer'
  },
  {
    name: 'Paul',
    description: 'Apostle to the Gentiles, church planter, theologian',
    keyVerses: ['Acts 9:15', 'Galatians 2:20', 'Philippians 3:7-8'],
    significance: 'Spread Christianity to the Gentile world'
  }
];

const thematicStudies: ThematicStudy[] = [
  {
    theme: 'Love',
    description: 'God\'s love and our call to love others',
    verses: [
      { book: 'John', chapter: 3, verse: 16, text: 'For God so loved the world...', context: 'God\'s sacrificial love' },
      { book: '1 Corinthians', chapter: 13, verse: 4, text: 'Love is patient, love is kind...', context: 'Characteristics of love' },
      { book: '1 John', chapter: 4, verse: 19, text: 'We love because he first loved us', context: 'Source of our love' }
    ]
  },
  {
    theme: 'Faith',
    description: 'Trust and belief in God throughout Scripture',
    verses: [
      { book: 'Hebrews', chapter: 11, verse: 1, text: 'Faith is confidence in what we hope for...', context: 'Definition of faith' },
      { book: 'Romans', chapter: 10, verse: 17, text: 'Faith comes from hearing the message...', context: 'How faith comes' },
      { book: 'James', chapter: 2, verse: 17, text: 'Faith by itself, if it is not accompanied by action...', context: 'Faith and works' }
    ]
  }
];

interface StudyToolsProps {
  isOpen: boolean;
  onClose: () => void;
  currentVerse?: { book: string; chapter: number; verse: number };
  onNavigate: (book: string, chapter: number, verse?: number) => void;
}

export const StudyTools: React.FC<StudyToolsProps> = ({
  isOpen, onClose, currentVerse, onNavigate
}) => {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'cross-refs' | 'characters' | 'themes'>('cross-refs');

  if (!isOpen) return null;

  const verseKey = currentVerse ? `${currentVerse.book}-${currentVerse.chapter}-${currentVerse.verse}` : '';
  const relevantCrossRefs = crossReferences[verseKey] || [];

  return (
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
        className="w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: currentTheme.colors.surface,
          border: `1px solid ${currentTheme.colors.border}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b" style={{ borderColor: currentTheme.colors.border }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold" style={{ color: currentTheme.colors.text }}>
              Study Tools
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:opacity-70 transition-opacity"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              ✕
            </button>
          </div>
          
          <div className="flex gap-2 mt-4">
            {[
              { key: 'cross-refs', label: '🔗 Cross References', count: relevantCrossRefs.length },
              { key: 'characters', label: '👤 Characters', count: characters.length },
              { key: 'themes', label: '📚 Themes', count: thematicStudies.length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className="px-4 py-2 text-sm rounded-lg border transition-all"
                style={{
                  backgroundColor: activeTab === tab.key ? currentTheme.colors.primary : 'transparent',
                  borderColor: currentTheme.colors.border,
                  color: activeTab === tab.key ? 'white' : currentTheme.colors.text
                }}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'cross-refs' && (
              <motion.div
                key="cross-refs"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {currentVerse ? (
                  <>
                    <div className="mb-4">
                      <h3 className="font-medium mb-2" style={{ color: currentTheme.colors.text }}>
                        Cross References for {currentVerse.book} {currentVerse.chapter}:{currentVerse.verse}
                      </h3>
                    </div>
                    
                    {relevantCrossRefs.length > 0 ? (
                      relevantCrossRefs.map((ref, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all"
                          style={{
                            backgroundColor: currentTheme.colors.background,
                            borderColor: currentTheme.colors.border
                          }}
                          onClick={() => onNavigate(ref.book, ref.chapter, ref.verse)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium" style={{ color: currentTheme.colors.primary }}>
                              {ref.book} {ref.chapter}:{ref.verse}
                            </div>
                            <div className="text-xs px-2 py-1 rounded" 
                              style={{ 
                                backgroundColor: currentTheme.colors.primary + '20',
                                color: currentTheme.colors.primary
                              }}
                            >
                              {ref.connection}
                            </div>
                          </div>
                          <p className="text-sm" style={{ color: currentTheme.colors.text }}>
                            {ref.text}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">🔗</div>
                        <p style={{ color: currentTheme.colors.textSecondary }}>
                          No cross references available for this verse.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📖</div>
                    <p style={{ color: currentTheme.colors.textSecondary }}>
                      Select a verse to see cross references.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'characters' && (
              <motion.div
                key="characters"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {characters.map(character => (
                  <div
                    key={character.name}
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: currentTheme.colors.background,
                      borderColor: currentTheme.colors.border
                    }}
                  >
                    <h3 className="font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
                      {character.name}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: currentTheme.colors.textSecondary }}>
                      {character.description}
                    </p>
                    <div className="mb-3">
                      <div className="text-sm font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                        Key Verses:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {character.keyVerses.map(verse => (
                          <span
                            key={verse}
                            className="text-xs px-2 py-1 rounded"
                            style={{
                              backgroundColor: currentTheme.colors.primary + '20',
                              color: currentTheme.colors.primary
                            }}
                          >
                            {verse}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm" style={{ color: currentTheme.colors.text }}>
                      <strong>Significance:</strong> {character.significance}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'themes' && (
              <motion.div
                key="themes"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {thematicStudies.map(study => (
                  <div
                    key={study.theme}
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: currentTheme.colors.background,
                      borderColor: currentTheme.colors.border
                    }}
                  >
                    <h3 className="font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
                      {study.theme}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: currentTheme.colors.textSecondary }}>
                      {study.description}
                    </p>
                    <div className="space-y-3">
                      {study.verses.map((verse, index) => (
                        <div
                          key={index}
                          className="p-3 rounded border cursor-pointer hover:shadow-sm transition-all"
                          style={{
                            backgroundColor: currentTheme.colors.surface,
                            borderColor: currentTheme.colors.border
                          }}
                          onClick={() => onNavigate(verse.book, verse.chapter, verse.verse)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium text-sm" style={{ color: currentTheme.colors.primary }}>
                              {verse.book} {verse.chapter}:{verse.verse}
                            </div>
                            <div className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                              {verse.context}
                            </div>
                          </div>
                          <p className="text-sm" style={{ color: currentTheme.colors.text }}>
                            {verse.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
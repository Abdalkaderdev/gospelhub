import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface StudySection {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

interface CrossReference {
  reference: string;
  text: string;
  theme: string;
}

interface Character {
  name: string;
  description: string;
  keyTraits: string[];
  significance: string;
  relatedVerses: string[];
}

interface ThemeCollection {
  name: string;
  description: string;
  verses: Array<{ reference: string; text: string; context: string }>;
}

interface AdvancedStudyPanelProps {
  book: string;
  chapter: number;
  verse?: number;
  onNavigate: (book: string, chapter: number, verse?: number) => void;
}

export const AdvancedStudyPanel: React.FC<AdvancedStudyPanelProps> = ({
  book, chapter, verse, onNavigate
}) => {
  const { currentTheme } = useTheme();
  const [expandedSections, setExpandedSections] = useState<string[]>(['cross-refs']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Sample data - in real app, this would come from props or API
  const crossReferences: CrossReference[] = [
    { reference: 'Romans 5:8', text: 'But God demonstrates his own love for us...', theme: 'God\'s Love' },
    { reference: '1 John 4:9', text: 'This is how God showed his love among us...', theme: 'Divine Love' },
    { reference: 'Romans 6:23', text: 'For the wages of sin is death, but the gift...', theme: 'Eternal Life' }
  ];

  const characters: Character[] = [
    {
      name: 'Jesus Christ',
      description: 'The Son of God, Savior of the world',
      keyTraits: ['Compassionate', 'Holy', 'Sacrificial', 'Divine'],
      significance: 'Central figure of Christianity, bridge between God and humanity',
      relatedVerses: ['John 1:1', 'John 14:6', 'Philippians 2:6-8']
    }
  ];

  const themeCollections: ThemeCollection[] = [
    {
      name: 'Salvation',
      description: 'God\'s plan of redemption for humanity',
      verses: [
        { reference: 'John 3:16', text: 'For God so loved the world...', context: 'God\'s love and sacrifice' },
        { reference: 'Romans 10:9', text: 'If you declare with your mouth...', context: 'How to be saved' },
        { reference: 'Ephesians 2:8-9', text: 'For it is by grace you have been saved...', context: 'Salvation by grace' }
      ]
    }
  ];

  const studySections: StudySection[] = [
    {
      id: 'cross-refs',
      title: 'Cross References',
      icon: '🔗',
      content: (
        <div className="space-y-3">
          {crossReferences.map((ref, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all"
              style={{
                backgroundColor: currentTheme.colors.background,
                borderColor: currentTheme.colors.border
              }}
              onClick={() => {
                const [bookName, chapterVerse] = ref.reference.split(' ');
                const [chapterNum, verseNum] = chapterVerse.split(':');
                onNavigate(bookName, parseInt(chapterNum), parseInt(verseNum));
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-sm" style={{ color: currentTheme.colors.primary }}>
                  {ref.reference}
                </span>
                <span className="text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor: currentTheme.colors.primary + '20',
                    color: currentTheme.colors.primary
                  }}
                >
                  {ref.theme}
                </span>
              </div>
              <p className="text-sm" style={{ color: currentTheme.colors.text }}>
                {ref.text}
              </p>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      id: 'characters',
      title: 'Character Studies',
      icon: '👤',
      content: (
        <div className="space-y-4">
          {characters.map((character, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: currentTheme.colors.background,
                borderColor: currentTheme.colors.border
              }}
            >
              <h4 className="font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
                {character.name}
              </h4>
              <p className="text-sm mb-3" style={{ color: currentTheme.colors.textSecondary }}>
                {character.description}
              </p>
              
              <div className="mb-3">
                <div className="text-sm font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                  Key Traits:
                </div>
                <div className="flex flex-wrap gap-1">
                  {character.keyTraits.map(trait => (
                    <span
                      key={trait}
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: currentTheme.colors.accent + '20',
                        color: currentTheme.colors.text
                      }}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-sm font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                  Significance:
                </div>
                <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                  {character.significance}
                </p>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                  Related Verses:
                </div>
                <div className="flex flex-wrap gap-2">
                  {character.relatedVerses.map(verseRef => (
                    <button
                      key={verseRef}
                      className="text-xs px-2 py-1 rounded hover:opacity-80 transition-opacity"
                      style={{
                        backgroundColor: currentTheme.colors.primary,
                        color: 'white'
                      }}
                      onClick={() => {
                        const [bookName, chapterVerse] = verseRef.split(' ');
                        const [chapterNum, verseNum] = chapterVerse.split(':');
                        onNavigate(bookName, parseInt(chapterNum), parseInt(verseNum));
                      }}
                    >
                      {verseRef}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      id: 'themes',
      title: 'Thematic Collections',
      icon: '📚',
      content: (
        <div className="space-y-4">
          {themeCollections.map((theme, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: currentTheme.colors.background,
                borderColor: currentTheme.colors.border
              }}
            >
              <h4 className="font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
                {theme.name}
              </h4>
              <p className="text-sm mb-3" style={{ color: currentTheme.colors.textSecondary }}>
                {theme.description}
              </p>
              
              <div className="space-y-2">
                {theme.verses.map((verse, vIndex) => (
                  <div
                    key={vIndex}
                    className="p-2 rounded border cursor-pointer hover:shadow-sm transition-all"
                    style={{
                      backgroundColor: currentTheme.colors.surface,
                      borderColor: currentTheme.colors.border
                    }}
                    onClick={() => {
                      const [bookName, chapterVerse] = verse.reference.split(' ');
                      const [chapterNum, verseNum] = chapterVerse.split(':');
                      onNavigate(bookName, parseInt(chapterNum), parseInt(verseNum));
                    }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm" style={{ color: currentTheme.colors.primary }}>
                        {verse.reference}
                      </span>
                      <span className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                        {verse.context}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: currentTheme.colors.text }}>
                      {verse.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-2">
      {studySections.map(section => (
        <motion.div
          key={section.id}
          className="rounded-lg border overflow-hidden"
          style={{
            backgroundColor: currentTheme.colors.surface,
            borderColor: currentTheme.colors.border
          }}
        >
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full p-4 text-left flex items-center justify-between hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{section.icon}</span>
              <span className="font-medium" style={{ color: currentTheme.colors.text }}>
                {section.title}
              </span>
            </div>
            <motion.span
              animate={{ rotate: expandedSections.includes(section.id) ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ color: currentTheme.colors.textSecondary }}
            >
              ▼
            </motion.span>
          </button>
          
          <AnimatePresence>
            {expandedSections.includes(section.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="p-4 border-t" style={{ borderColor: currentTheme.colors.border }}>
                  {section.content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};
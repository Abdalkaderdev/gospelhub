import React, { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, Volume2, Copy, BookOpen, Zap } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface OriginalText {
  text: string;
  transliteration: string;
  pronunciation: string;
  morphology: string;
  parsing: string[];
}

interface OriginalLanguageToolsProps {
  verse: string;
  hebrewText?: OriginalText;
  greekText?: OriginalText;
  isOpen: boolean;
  onToggle: () => void;
}

const LanguagePanel = memo<{
  title: string;
  text: OriginalText;
  language: 'hebrew' | 'greek';
  isActive: boolean;
  onActivate: () => void;
}>(({ title, text, language, isActive, onActivate }) => {
  const { currentTheme } = useTheme();
  const [showMorphology, setShowMorphology] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text.text);
  }, [text.text]);

  const handlePlayAudio = useCallback(() => {
    // Placeholder for text-to-speech functionality
    console.log(`Playing ${language} pronunciation: ${text.pronunciation}`);
  }, [language, text.pronunciation]);

  return (
    <motion.div
      className={`border rounded-xl overflow-hidden cursor-pointer ${isActive ? 'ring-2' : ''}`}
      style={{
        borderColor: currentTheme.colors.border,
        backgroundColor: isActive ? currentTheme.colors.primary + '10' : currentTheme.colors.surface,
        ringColor: isActive ? currentTheme.colors.primary : 'transparent'
      }}
      onClick={onActivate}
      whileHover={{ scale: 1.02 }}
      layout
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold" style={{ color: currentTheme.colors.text }}>
            {title}
          </h4>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePlayAudio();
              }}
              className="p-1 rounded hover:opacity-70 transition-opacity"
              style={{ color: currentTheme.colors.primary }}
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="p-1 rounded hover:opacity-70 transition-opacity"
              style={{ color: currentTheme.colors.primary }}
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Original Text */}
        <div className="mb-3">
          <p 
            className={`text-2xl mb-2 ${language === 'hebrew' ? 'text-right' : 'text-left'}`}
            style={{ 
              color: currentTheme.colors.text,
              fontFamily: language === 'hebrew' ? 'SBL Hebrew, serif' : 'SBL Greek, serif'
            }}
          >
            {text.text}
          </p>
          <p 
            className="text-sm italic"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            {text.transliteration}
          </p>
          <p 
            className="text-xs"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            [{text.pronunciation}]
          </p>
        </div>

        {/* Morphology Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMorphology(!showMorphology);
          }}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
          style={{ color: currentTheme.colors.primary }}
        >
          <Zap className="w-4 h-4" />
          Morphology
        </button>

        {/* Morphology Details */}
        <AnimatePresence>
          {showMorphology && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 pt-3 border-t"
              style={{ borderColor: currentTheme.colors.border }}
            >
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium" style={{ color: currentTheme.colors.text }}>
                    Morphology:
                  </span>
                  <span className="text-xs ml-2" style={{ color: currentTheme.colors.textSecondary }}>
                    {text.morphology}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-medium" style={{ color: currentTheme.colors.text }}>
                    Parsing:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {text.parsing.map((part, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: currentTheme.colors.accent + '20',
                          color: currentTheme.colors.accent
                        }}
                      >
                        {part}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

LanguagePanel.displayName = 'LanguagePanel';

export const OriginalLanguageTools = memo<OriginalLanguageToolsProps>(({
  verse,
  hebrewText,
  greekText,
  isOpen,
  onToggle
}) => {
  const { currentTheme } = useTheme();
  const [activeLanguage, setActiveLanguage] = useState<'hebrew' | 'greek' | null>(null);

  const handleLanguageActivate = useCallback((language: 'hebrew' | 'greek') => {
    setActiveLanguage(prev => prev === language ? null : language);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="border rounded-2xl overflow-hidden shadow-lg"
          style={{
            borderColor: currentTheme.colors.border,
            backgroundColor: currentTheme.colors.surface
          }}
        >
          {/* Header */}
          <div className="p-4 border-b" style={{ borderColor: currentTheme.colors.border }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Languages className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
                <h3 className="font-semibold" style={{ color: currentTheme.colors.text }}>
                  Original Languages
                </h3>
              </div>
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                ✕
              </button>
            </div>
            <p className="text-sm mt-1" style={{ color: currentTheme.colors.textSecondary }}>
              {verse}
            </p>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="grid gap-4">
              {/* Hebrew Panel */}
              {hebrewText && (
                <LanguagePanel
                  title="Hebrew (Masoretic Text)"
                  text={hebrewText}
                  language="hebrew"
                  isActive={activeLanguage === 'hebrew'}
                  onActivate={() => handleLanguageActivate('hebrew')}
                />
              )}

              {/* Greek Panel */}
              {greekText && (
                <LanguagePanel
                  title="Greek (Textus Receptus)"
                  text={greekText}
                  language="greek"
                  isActive={activeLanguage === 'greek'}
                  onActivate={() => handleLanguageActivate('greek')}
                />
              )}
            </div>

            {/* Comparison View */}
            <AnimatePresence>
              {activeLanguage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 pt-4 border-t"
                  style={{ borderColor: currentTheme.colors.border }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
                    <h4 className="font-medium" style={{ color: currentTheme.colors.text }}>
                      Interlinear View
                    </h4>
                  </div>
                  
                  <div 
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: currentTheme.colors.background }}
                  >
                    <div className="space-y-2">
                      <div className="text-center">
                        <p 
                          className="text-xl mb-1"
                          style={{ 
                            color: currentTheme.colors.text,
                            fontFamily: activeLanguage === 'hebrew' ? 'SBL Hebrew, serif' : 'SBL Greek, serif'
                          }}
                        >
                          {activeLanguage === 'hebrew' ? hebrewText?.text : greekText?.text}
                        </p>
                        <p 
                          className="text-sm italic"
                          style={{ color: currentTheme.colors.textSecondary }}
                        >
                          {activeLanguage === 'hebrew' ? hebrewText?.transliteration : greekText?.transliteration}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

OriginalLanguageTools.displayName = 'OriginalLanguageTools';
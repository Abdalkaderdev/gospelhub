import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface Translation {
  id: string;
  name: string;
  language: string;
  direction: 'ltr' | 'rtl';
  file: string;
}

const translations: Translation[] = [
  { id: 'eng-kjv', name: 'King James Version', language: 'English', direction: 'ltr', file: 'eng-kjv.json' },
  { id: 'eng-esv', name: 'English Standard Version', language: 'English', direction: 'ltr', file: 'eng-esv.json' },
  { id: 'eng-niv', name: 'New International Version', language: 'English', direction: 'ltr', file: 'eng-niv.json' },
  { id: 'spa-rv60', name: 'Reina-Valera 1960', language: 'Spanish', direction: 'ltr', file: 'spa-rv60.json' },
  { id: 'spa-nvi', name: 'Nueva Versión Internacional', language: 'Spanish', direction: 'ltr', file: 'spa-nvi.json' },
  { id: 'ara-svd', name: 'Smith & Van Dyke', language: 'Arabic', direction: 'rtl', file: 'ara-svd.json' },
  { id: 'ara-vd', name: 'Van Dyke', language: 'Arabic', direction: 'rtl', file: 'ara-vd.json' }
];

interface TranslationSwitcherProps {
  currentTranslation: string;
  onTranslationChange: (translationId: string, translationData: any) => void;
}

export const TranslationSwitcher: React.FC<TranslationSwitcherProps> = ({
  currentTranslation,
  onTranslationChange
}) => {
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [translationData, setTranslationData] = useState<Record<string, any>>({});

  useEffect(() => {
    const savedTranslation = localStorage.getItem('selectedTranslation');
    if (savedTranslation && savedTranslation !== currentTranslation) {
      loadTranslation(savedTranslation);
    }
  }, []);

  const loadTranslation = async (translationId: string) => {
    if (translationData[translationId]) {
      onTranslationChange(translationId, translationData[translationId]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/src/data/processed/${translations.find(t => t.id === translationId)?.file}`);
      const data = await response.json();
      
      setTranslationData(prev => ({ ...prev, [translationId]: data }));
      onTranslationChange(translationId, data);
      localStorage.setItem('selectedTranslation', translationId);
    } catch (error) {
      console.error('Failed to load translation:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentTranslationInfo = translations.find(t => t.id === currentTranslation);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:opacity-90"
        style={{
          backgroundColor: currentTheme.colors.surface,
          borderColor: currentTheme.colors.border,
          color: currentTheme.colors.text
        }}
      >
        <span className="text-sm font-medium">
          {loading ? 'Loading...' : currentTranslationInfo?.name || 'Select Translation'}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-80 rounded-lg border shadow-lg z-50 overflow-hidden"
            style={{
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.border
            }}
          >
            <div className="max-h-64 overflow-y-auto">
              {['English', 'Spanish', 'Arabic'].map(language => (
                <div key={language}>
                  <div 
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wide border-b"
                    style={{
                      backgroundColor: currentTheme.colors.background,
                      color: currentTheme.colors.textSecondary,
                      borderColor: currentTheme.colors.border
                    }}
                  >
                    {language}
                  </div>
                  {translations
                    .filter(t => t.language === language)
                    .map(translation => (
                      <button
                        key={translation.id}
                        onClick={() => {
                          loadTranslation(translation.id);
                          setIsOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-opacity-50 transition-colors border-b last:border-b-0"
                        style={{
                          backgroundColor: currentTranslation === translation.id ? currentTheme.colors.primary + '20' : 'transparent',
                          color: currentTheme.colors.text,
                          borderColor: currentTheme.colors.border,
                          direction: translation.direction
                        }}
                      >
                        <div className="font-medium">{translation.name}</div>
                        <div className="text-xs mt-1" style={{ color: currentTheme.colors.textSecondary }}>
                          {translation.language} • {translation.direction.toUpperCase()}
                        </div>
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
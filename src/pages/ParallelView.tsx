import { useState, useEffect } from 'react';
import { MainLayout } from './layouts';
import { bibleDataService, BibleVerse } from '../services/BibleDataService';
import { useTheme } from '../contexts/ThemeContext';

interface VerseComparison {
  reference: string;
  verses: { [translationId: string]: BibleVerse };
}

export const ParallelView = () => {
  const { currentTheme } = useTheme();
  const [selectedTranslations, setSelectedTranslations] = useState(['eng-esv', 'eng-niv']);
  const [currentBook, setCurrentBook] = useState('John');
  const [currentChapter, setCurrentChapter] = useState(3);
  const [currentVerseNum, setCurrentVerseNum] = useState(16);
  const [verseComparison, setVerseComparison] = useState<VerseComparison | null>(null);
  const [loading, setLoading] = useState(false);
  
  const availableTranslations = bibleDataService.getTranslations().filter(t => t.language === 'English');
  
  useEffect(() => {
    loadVerseComparison();
  }, [currentBook, currentChapter, currentVerseNum, selectedTranslations]);
  
  const loadVerseComparison = async () => {
    setLoading(true);
    try {
      const verses: { [translationId: string]: BibleVerse } = {};
      
      for (const translationId of selectedTranslations) {
        const chapterVerses = await bibleDataService.getChapter(translationId, currentBook, currentChapter);
        const verse = chapterVerses.find(v => v.number === currentVerseNum);
        if (verse) {
          verses[translationId] = verse;
        }
      }
      
      setVerseComparison({
        reference: `${currentBook} ${currentChapter}:${currentVerseNum}`,
        verses
      });
    } catch (error) {
      console.error('Error loading verse comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTranslation = (translationId: string) => {
    if (selectedTranslations.includes(translationId)) {
      setSelectedTranslations(selectedTranslations.filter(t => t !== translationId));
    } else if (selectedTranslations.length < 4) {
      setSelectedTranslations([...selectedTranslations, translationId]);
    }
  };

  return (
    <MainLayout title="Parallel View">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Parallel Translation View</h1>
        
        <div 
          className="rounded-lg shadow-sm p-6 mb-6"
          style={{ backgroundColor: currentTheme.colors.surface }}
        >
          <h2 
            className="text-xl font-semibold mb-4"
            style={{ color: currentTheme.colors.text }}
          >
            Select Translations (max 4)
          </h2>
          <div className="flex flex-wrap gap-2">
            {availableTranslations.map(translation => (
              <button
                key={translation.id}
                onClick={() => toggleTranslation(translation.id)}
                className="px-3 py-1 rounded-lg border transition-colors"
                style={{
                  backgroundColor: selectedTranslations.includes(translation.id) 
                    ? currentTheme.colors.accent 
                    : currentTheme.colors.surface,
                  color: selectedTranslations.includes(translation.id) 
                    ? 'white' 
                    : currentTheme.colors.text,
                  borderColor: selectedTranslations.includes(translation.id) 
                    ? currentTheme.colors.accent 
                    : currentTheme.colors.border
                }}
              >
                {translation.abbreviation}
              </button>
            ))}
          </div>
        </div>

        <div 
          className="rounded-lg shadow-sm p-6 mb-6"
          style={{ backgroundColor: currentTheme.colors.surface }}
        >
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <h2 
              className="text-xl font-semibold"
              style={{ color: currentTheme.colors.text }}
            >
              {verseComparison?.reference || `${currentBook} ${currentChapter}:${currentVerseNum}`}
            </h2>
            <div className="flex gap-2">
              <select 
                value={currentBook}
                onChange={(e) => setCurrentBook(e.target.value)}
                className="px-2 py-1 border rounded text-sm"
                style={{ 
                  backgroundColor: currentTheme.colors.background,
                  color: currentTheme.colors.text,
                  borderColor: currentTheme.colors.border
                }}
              >
                {bibleDataService.getBookNames().slice(39, 66).map(book => (
                  <option key={book} value={book}>{book}</option>
                ))}
              </select>
              <input 
                type="number" 
                value={currentChapter}
                onChange={(e) => setCurrentChapter(parseInt(e.target.value) || 1)}
                min="1" max="28"
                className="w-16 px-2 py-1 border rounded text-sm"
                style={{ 
                  backgroundColor: currentTheme.colors.background,
                  color: currentTheme.colors.text,
                  borderColor: currentTheme.colors.border
                }}
              />
              <span style={{ color: currentTheme.colors.text }}>:</span>
              <input 
                type="number" 
                value={currentVerseNum}
                onChange={(e) => setCurrentVerseNum(parseInt(e.target.value) || 1)}
                min="1" max="50"
                className="w-16 px-2 py-1 border rounded text-sm"
                style={{ 
                  backgroundColor: currentTheme.colors.background,
                  color: currentTheme.colors.text,
                  borderColor: currentTheme.colors.border
                }}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div style={{ color: currentTheme.colors.textSecondary }}>Loading...</div>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              selectedTranslations.length === 1 ? 'grid-cols-1' :
              selectedTranslations.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
              selectedTranslations.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'
            }`}>
              {selectedTranslations.map(translationId => {
                const translation = bibleDataService.getTranslation(translationId);
                const verse = verseComparison?.verses[translationId];
                return (
                  <div 
                    key={translationId} 
                    className="border rounded-lg p-4"
                    style={{ borderColor: currentTheme.colors.border }}
                  >
                    <h3 
                      className="font-semibold mb-2"
                      style={{ color: currentTheme.colors.accent }}
                    >
                      {translation?.abbreviation || translationId.toUpperCase()}
                    </h3>
                    <p 
                      className="leading-relaxed"
                      style={{ color: currentTheme.colors.text }}
                    >
                      {verse?.text || 'Verse not available'}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div 
          className="rounded-lg shadow-sm p-6"
          style={{ backgroundColor: currentTheme.colors.surface }}
        >
          <h2 
            className="text-xl font-semibold mb-4"
            style={{ color: currentTheme.colors.text }}
          >
            Comparison Tools
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button 
              className="p-3 border rounded-lg transition-colors"
              style={{ 
                borderColor: currentTheme.colors.border,
                color: currentTheme.colors.text
              }}
            >
              📝 Highlight Differences
            </button>
            <button 
              className="p-3 border rounded-lg transition-colors"
              style={{ 
                borderColor: currentTheme.colors.border,
                color: currentTheme.colors.text
              }}
            >
              📊 Word Analysis
            </button>
            <button 
              className="p-3 border rounded-lg transition-colors"
              style={{ 
                borderColor: currentTheme.colors.border,
                color: currentTheme.colors.text
              }}
            >
              💾 Save Comparison
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
import React, { useState, useEffect, useMemo } from 'react';
import { TestamentNavigator } from './navigation/TestamentNavigator';
import { AdvancedSearchPanel } from './search/AdvancedSearchPanel';
import { TranslationComparisonView, generateTranslationComparison } from './comparison/TranslationComparison';
import { ReadingPlanView } from './plans/ReadingPlanView';
import { AdvancedSearchService } from '../services/AdvancedSearchService';
import { ReadingPlanService } from '../services/ReadingPlanService';
import { getBibleTranslations, getAllTranslations, getTranslationById } from '../data';
import { AdvancedSearchOptions, SearchResultEnhanced, ReadingPlan } from '../types/bible-enhanced';
import { VerseHighlighter } from './VerseHighlighter';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

// Simple Search Component
const SimpleSearch: React.FC<{ translations: any[] }> = ({ translations }) => {
  const { currentTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = () => {
    if (!query.trim() || translations.length === 0) return;
    
    setIsSearching(true);
    const searchResults: any[] = [];
    const searchTerm = query.toLowerCase();
    
    translations.forEach(translation => {
      Object.entries(translation.data).forEach(([bookName, bookData]: [string, any]) => {
        Object.entries(bookData.verses || {}).forEach(([chapterNum, verses]: [string, any]) => {
          const chapter = parseInt(chapterNum);
          verses.forEach((verse: any, index: number) => {
            const verseText = typeof verse === 'string' ? verse : verse.text || '';
            if (verseText.toLowerCase().includes(searchTerm)) {
              searchResults.push({
                book: bookName,
                chapter,
                verse: typeof verse === 'object' && verse.verse ? verse.verse : index + 1,
                text: verseText,
                translation: translation.name
              });
            }
          });
        });
      });
    });
    
    setResults(searchResults.slice(0, 50)); // Limit to 50 results
    setIsSearching(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search for verses..."
          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={!query.trim() || isSearching}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      {results.length > 0 && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <h4 className="font-medium" style={{ color: currentTheme.colors.text }}>
            Found {results.length} results:
          </h4>
          {results.map((result, index) => (
            <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="font-medium text-blue-600 mb-1">
                {result.book} {result.chapter}:{result.verse} ({result.translation})
              </div>
              <div className="text-sm" style={{ color: currentTheme.colors.text }}>
                {result.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Bible Reader Component
const BibleReader: React.FC<{ book: string; translations: any[] }> = ({ book, translations }) => {
  const { currentTheme } = useTheme();
  const [currentChapter, setCurrentChapter] = useState(1);
  const [selectedTranslation, setSelectedTranslation] = useState(translations[0]?.id || 'kjv');
  
  const translation = useMemo(() => {
    return translations.find(t => t.id === selectedTranslation) || translations[0];
  }, [selectedTranslation, translations]);
  
  const chapterOptions = useMemo(() => {
    if (!translation?.data?.[book]) return [];
    return translation.data[book].chapters || [];
  }, [translation, book]);
  
  const currentVerses = useMemo(() => {
    if (!translation?.data?.[book]?.verses?.[currentChapter]) return [];
    return translation.data[book].verses[currentChapter] || [];
  }, [translation, book, currentChapter]);
  
  // Reset chapter when book changes
  useEffect(() => {
    setCurrentChapter(1);
  }, [book]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedTranslation}
          onChange={(e) => setSelectedTranslation(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {translations.map(t => (
            <option key={t.id} value={t.id}>{t.name} ({t.abbreviation})</option>
          ))}
        </select>
        
        <select
          value={currentChapter}
          onChange={(e) => setCurrentChapter(Number(e.target.value))}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {chapterOptions.map(ch => (
            <option key={ch} value={ch}>Chapter {ch}</option>
          ))}
        </select>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4" style={{ color: currentTheme.colors.text }}>
          {book} {currentChapter}
        </h3>
        
        {!translation ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading translation...</p>
          </div>
        ) : !translation.data[book] ? (
          <div className="text-center py-8">
            <div className="text-yellow-500 text-4xl mb-4">📖</div>
            <p className="text-gray-500 mb-4">Book "{book}" not available in {translation.name}.</p>
            <p className="text-sm text-gray-400">
              Available books: {Object.keys(translation.data).slice(0, 5).join(', ')}{Object.keys(translation.data).length > 5 ? '...' : ''}
            </p>
          </div>
        ) : currentVerses.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-blue-500 text-4xl mb-4">📄</div>
            <p className="text-gray-500 mb-4">No verses available for {book} chapter {currentChapter}.</p>
            <p className="text-sm text-gray-400">
              Available chapters: {chapterOptions.join(', ') || 'None'}
            </p>
          </div>
        ) : (
          currentVerses.map((verse: any, index: number) => {
            const verseText = typeof verse === 'string' ? verse : verse.text || verse;
            const verseNumber = typeof verse === 'object' && verse.verse ? verse.verse : index + 1;
            
            return (
              <VerseHighlighter
                key={`${book}-${currentChapter}-${verseNumber}`}
                book={book}
                chapter={currentChapter}
                verse={verseNumber}
                text={verseText}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-medium text-blue-600 mr-3">
                    {verseNumber}
                  </span>
                  <span style={{ color: currentTheme.colors.text }}>
                    {verseText}
                  </span>
                </motion.div>
              </VerseHighlighter>
            );
          })
        )}
      </div>
    </div>
  );
};

export const BibleEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'navigate' | 'search' | 'compare' | 'plans'>('navigate');
  const [translations, setTranslations] = useState<any[]>([]);
  const [currentBook, setCurrentBook] = useState('Genesis');
  const [searchResults, setSearchResults] = useState<SearchResultEnhanced[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [comparison, setComparison] = useState<any>(null);
  const [readingPlan, setReadingPlan] = useState<ReadingPlan | null>(null);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load actual translations with data, not just metadata
    const loadTranslations = async () => {
      try {
        const tsTranslations = getBibleTranslations();
        const loadedTranslations = [];
        
        // Add TypeScript translations first
        for (const translation of tsTranslations) {
          loadedTranslations.push(translation);
        }
        
        setTranslations(loadedTranslations);
      } catch (error) {
        console.error('Failed to load translations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTranslations();
  }, []);

  const handleSearch = async (query: string, options: AdvancedSearchOptions) => {
    setIsSearching(true);
    try {
      console.log('Searching with:', { query, options, translations: translations.length });
      const results = await AdvancedSearchService.searchAcrossTranslations(query, options, translations);
      console.log('Search results:', results);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCompareVerse = (book: string, chapter: number, verse: number) => {
    const selectedTranslations = translations.slice(0, 3).map(t => ({
      id: t.id,
      name: t.name,
      text: t.data[book]?.verses[chapter]?.find((v: any) => v.verse === verse)?.text || 'Verse not found'
    }));

    const comp = generateTranslationComparison(
      { book, chapter, verse },
      selectedTranslations
    );
    setComparison(comp);
    setActiveTab('compare');
  };

  const handlePlanSelect = (plan: ReadingPlan) => {
    setReadingPlan(plan);
  };

  const handleDayComplete = (day: number) => {
    setCompletedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Bible translations...</p>
        </div>
      </div>
    );
  }

  if (translations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Translations Available</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Unable to load Bible translations. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Gospel Hub - Enhanced Study
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Navigate, search, compare, and plan your Bible reading with {translations.length} translations
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              ← Back to Main
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {[
            { id: 'navigate', label: 'Navigate', icon: '📖' },
            { id: 'search', label: 'Search', icon: '🔍' },
            { id: 'compare', label: 'Compare', icon: '⚖️' },
            { id: 'plans', label: 'Reading Plans', icon: '📅' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'navigate' && (
            <div className="space-y-6">
              <TestamentNavigator
                currentBook={currentBook}
                onBookSelect={setCurrentBook}
                onCategorySelect={(category) => console.log('Category:', category)}
              />
              
              {currentBook && (
                <BibleReader 
                  book={currentBook}
                  translations={translations}
                />
              )}
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-6">
              <AdvancedSearchPanel
                onSearch={handleSearch}
                results={searchResults}
                isLoading={isSearching}
              />
              
              {/* Simple Search Fallback */}
              {searchResults.length === 0 && !isSearching && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Quick Search
                  </h3>
                  <SimpleSearch translations={translations} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'compare' && (
            <div className="space-y-6">
              {!comparison && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Compare Translations
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Select a verse to compare across translations
                  </p>
                  <button
                    onClick={() => handleCompareVerse('John', 3, 16)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Compare John 3:16
                  </button>
                </div>
              )}
              {comparison && (
                <TranslationComparisonView
                  comparison={comparison}
                  highlightDifferences={true}
                />
              )}
            </div>
          )}

          {activeTab === 'plans' && (
            <ReadingPlanView
              plan={readingPlan}
              completedDays={completedDays}
              onDayComplete={handleDayComplete}
              onPlanSelect={handlePlanSelect}
            />
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {translations.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Translations</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              66
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Books</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {searchResults.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Search Results</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {completedDays.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Days Read</div>
          </div>
        </div>
      </div>
    </div>
  );
};
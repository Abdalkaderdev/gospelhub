import React, { useState, useEffect } from 'react';
import { TestamentNavigator } from './navigation/TestamentNavigator';
import { AdvancedSearchPanel } from './search/AdvancedSearchPanel';
import { TranslationComparisonView, generateTranslationComparison } from './comparison/TranslationComparison';
import { ReadingPlanView } from './plans/ReadingPlanView';
import { AdvancedSearchService } from '../services/AdvancedSearchService';
import { ReadingPlanService } from '../services/ReadingPlanService';
import { getBibleTranslations } from '../data';
import { AdvancedSearchOptions, SearchResultEnhanced, ReadingPlan } from '../types/bible-enhanced';

export const BibleEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'navigate' | 'search' | 'compare' | 'plans'>('navigate');
  const [translations, setTranslations] = useState<any[]>([]);
  const [currentBook, setCurrentBook] = useState('Genesis');
  const [searchResults, setSearchResults] = useState<SearchResultEnhanced[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [comparison, setComparison] = useState<any>(null);
  const [readingPlan, setReadingPlan] = useState<ReadingPlan | null>(null);
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  useEffect(() => {
    getBibleTranslations().then(setTranslations);
  }, []);

  const handleSearch = async (query: string, options: AdvancedSearchOptions) => {
    setIsSearching(true);
    try {
      const results = await AdvancedSearchService.searchAcrossTranslations(query, options, translations);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Enhanced Bible Study
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Navigate, search, compare, and plan your Bible reading with {translations.length} translations
          </p>
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
            <TestamentNavigator
              currentBook={currentBook}
              onBookSelect={setCurrentBook}
              onCategorySelect={(category) => console.log('Category:', category)}
            />
          )}

          {activeTab === 'search' && (
            <AdvancedSearchPanel
              onSearch={handleSearch}
              results={searchResults}
              isLoading={isSearching}
            />
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
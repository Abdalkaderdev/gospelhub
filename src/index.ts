// Enhanced Bible Features Export
export * from './types/bible-enhanced';
export * from './services/BibleMetadataService';
export * from './services/AdvancedSearchService';
export * from './services/ReadingPlanService';
export * from './components/navigation/TestamentNavigator';
export * from './components/comparison/TranslationComparison';
export * from './components/search/AdvancedSearchPanel';
export * from './components/plans/ReadingPlanView';

// Usage Examples:
/*
// 1. Testament Navigation
import { TestamentNavigator } from './components/navigation/TestamentNavigator';
<TestamentNavigator 
  currentBook="Genesis" 
  onBookSelect={(book) => console.log(book)}
  onCategorySelect={(category) => console.log(category)}
/>

// 2. Advanced Search
import { AdvancedSearchPanel } from './components/search/AdvancedSearchPanel';
import { AdvancedSearchService } from './services/AdvancedSearchService';

const handleSearch = async (query, options) => {
  const results = await AdvancedSearchService.searchAcrossTranslations(
    query, options, translations
  );
  setSearchResults(results);
};

<AdvancedSearchPanel onSearch={handleSearch} results={searchResults} />

// 3. Translation Comparison
import { TranslationComparisonView, generateTranslationComparison } from './components/comparison/TranslationComparison';

const comparison = generateTranslationComparison(
  { book: 'John', chapter: 3, verse: 16 },
  [
    { id: 'kjv', name: 'King James Version', text: 'For God so loved the world...' },
    { id: 'niv', name: 'New International Version', text: 'For God so loved the world...' }
  ]
);

<TranslationComparisonView comparison={comparison} highlightDifferences={true} />

// 4. Reading Plans
import { ReadingPlanView } from './components/plans/ReadingPlanView';
import { ReadingPlanService } from './services/ReadingPlanService';

const plan = ReadingPlanService.generateReadingPlan('chronological', { duration: 365 });

<ReadingPlanView 
  plan={plan}
  completedDays={[1, 2, 3]}
  onDayComplete={(day) => console.log('Completed day:', day)}
/>

// 5. Word Frequency Analysis
const analysis = AdvancedSearchService.analyzeWordFrequency('love', translations);
console.log(`"love" appears ${analysis.count} times across ${analysis.translations.length} translations`);

// 6. Concordance Generation
const concordance = AdvancedSearchService.generateConcordance('faith', translations, 50);
console.log(`Found ${concordance.occurrences.length} occurrences of "faith"`);

// 7. XML Metadata Parsing
import { BibleMetadataService } from './services/BibleMetadataService';

const metadata = BibleMetadataService.parseXMLMetadata(xmlContent);
console.log(`Translation: ${metadata.translation}, Status: ${metadata.status}`);
console.log(`Old Testament: ${metadata.testaments[0].bookCount} books`);
console.log(`New Testament: ${metadata.testaments[1].bookCount} books`);
*/
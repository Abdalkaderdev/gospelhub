import { useState, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MainLayout } from './layouts';
import { SearchService } from '../search';

interface SearchResult {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  reference: string;
}

export const Search = () => {
  const { currentTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [translationId, setTranslationId] = useState('all');
  const searchService = new SearchService();
  const allTranslations = searchService.getTranslations();

  const searchBible = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const filters = translationId === 'all' ? {} : { translationId };
      const searchResults = await searchService.searchBible(query, filters);
      const formattedResults: SearchResult[] = searchResults.results.map(result => ({
        book: result.reference.book,
        chapter: result.reference.chapter,
        verse: result.reference.verse,
        text: result.verse.text,
        translation: result.translation,
        reference: `${result.reference.book} ${result.reference.chapter}:${result.reference.verse}`
      }));
      setResults(formattedResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, translationId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchBible();
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="bg-yellow-200">{part}</mark> : 
        part
    );
  };

  return (
    <MainLayout title="Search">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Bible Search</h1>
        
        <div 
          className="rounded-lg shadow-sm p-6 mb-6"
          style={{ backgroundColor: currentTheme.colors.surface }}
        >
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the Bible..." 
              className="flex-1 p-3 border rounded-lg"
              style={{ 
                backgroundColor: currentTheme.colors.background,
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border
              }}
            />
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg disabled:opacity-50 transition-colors"
              style={{ 
                backgroundColor: currentTheme.colors.accent,
                color: 'white'
              }}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          
          <div className="flex items-center gap-4">
            <label
              className="text-sm font-medium"
              style={{ color: currentTheme.colors.text }}
            >
              Translation:
            </label>
            <select
              value={translationId}
              onChange={(e) => setTranslationId(e.target.value)}
              className="px-3 py-1 border rounded"
              style={{
                backgroundColor: currentTheme.colors.background,
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border
              }}
            >
              <option value="all">All Translations</option>
              {allTranslations.map(translation => (
                <option key={translation.id} value={translation.id}>
                  {translation.name} ({translation.abbreviation})
                </option>
              ))}
            </select>
          </div>
        </div>

        {results.length > 0 && (
          <div
            className="rounded-lg shadow-sm p-6"
            style={{ backgroundColor: currentTheme.colors.surface }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: currentTheme.colors.text }}
            >
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </h2>

            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="border-b pb-4 last:border-b-0"
                  style={{ borderColor: currentTheme.colors.border }}
                >
                  <div
                    className="font-semibold mb-1"
                    style={{ color: currentTheme.colors.accent }}
                  >
                    {result.reference} ({result.translation})
                  </div>
                  <div style={{ color: currentTheme.colors.text }}>
                    {highlightText(result.text, query)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {query && !loading && results.length === 0 && (
          <div 
            className="rounded-lg shadow-sm p-6 text-center"
            style={{ backgroundColor: currentTheme.colors.surface }}
          >
            <p style={{ color: currentTheme.colors.textSecondary }}>
              No results found for "{query}"
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
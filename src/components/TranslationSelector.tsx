import { useState, useMemo } from 'react';
import { Search, Globe, Book } from 'lucide-react';
import { getAllTranslations } from '../data';

interface Translation {
  id: string;
  name: string;
  language: string;
  year?: string;
}

interface TranslationSelectorProps {
  selectedTranslation: string;
  onTranslationChange: (translationId: string) => void;
}

export const TranslationSelector = ({ selectedTranslation, onTranslationChange }: TranslationSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  const translations = useMemo(() => {
    return getAllTranslations().map(t => ({
      id: t.id,
      name: t.name,
      language: t.language,
      year: t.abbreviation
    }));
  }, []);

  const languages = useMemo(() => {
    const langs = [...new Set(translations.map(t => t.language))].sort();
    return langs;
  }, [translations]);

  const filteredTranslations = useMemo(() => {
    return translations.filter(translation => {
      const matchesSearch = translation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           translation.language.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLanguage = selectedLanguage === 'all' || translation.language === selectedLanguage;
      return matchesSearch && matchesLanguage;
    });
  }, [translations, searchTerm, selectedLanguage]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search translations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Languages</option>
          {languages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {filteredTranslations.map(translation => (
          <button
            key={translation.id}
            onClick={() => onTranslationChange(translation.id)}
            className={`p-3 rounded-lg border text-left transition-all hover:shadow-md ${
              selectedTranslation === translation.id
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-2">
              <Book className="w-4 h-4 mt-1 text-gray-500" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{translation.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Globe className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{translation.language}</span>
                  {translation.year && (
                    <span className="text-xs text-gray-400">({translation.year})</span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredTranslations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Book className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No translations found matching your search.</p>
        </div>
      )}
    </div>
  );
};
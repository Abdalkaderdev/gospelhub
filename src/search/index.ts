import { SearchResult, BibleSearchResult, BibleReference } from "../types";
import { fetchBibleVerse } from "../api/bible";
import { getAllTranslations, bibleDataService } from "../data";

export interface SearchFilters {
  testament?: 'old' | 'new' | 'all';
  book?: string;
  phraseMatch?: boolean;
  translationId?: string;
}

export class SearchService {
  private translationId: string;
  private oldTestamentBooks = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'];
  private newTestamentBooks = ['Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians'];

  constructor(translationId: string = "kjv") {
    this.translationId = translationId;
  }

  async searchBible(query: string, filters: SearchFilters = {}): Promise<SearchResult<BibleSearchResult>> {
    if (!query.trim()) {
      return { results: [], total: 0 };
    }

    const translations = filters.translationId
      ? getAllTranslations().filter(t => t.id === filters.translationId)
      : getAllTranslations();
    
    const searchPromises = translations.map(async (translation) => {
      const translationData = await bibleDataService.loadTranslation(translation.id);
      if (!translationData) return [];

      let allBooks = Object.keys(translationData);

      // Apply testament filter
      if (filters.testament && filters.testament !== 'all') {
        const testamentBooks = filters.testament === 'old' ? this.oldTestamentBooks : this.newTestamentBooks;
        allBooks = allBooks.filter(book => testamentBooks.includes(book));
      }

      // Apply book filter
      if (filters.book) {
        allBooks = allBooks.filter(book => book === filters.book);
      }

      const results: BibleSearchResult[] = [];
      for (const book of allBooks) {
        const bookData = translationData[book];
        if (!bookData) continue;

        for (const chapterNum in bookData) {
          const verses = bookData[chapterNum];
          if (!verses) continue;

          for (const verse of verses) {
            let matches = false;

            if (filters.phraseMatch) {
              matches = verse.text.toLowerCase().includes(query.toLowerCase());
            } else {
              const searchWords = query.toLowerCase().split(' ');
              matches = searchWords.some(word => verse.text.toLowerCase().includes(word));
            }

            if (matches) {
              results.push({
                reference: {
                  book: book,
                  chapter: parseInt(chapterNum),
                  verse: verse.number,
                },
                verse: verse,
                translation: translation.name,
              });
            }
          }
        }
      }
      return results;
    });

    const allResults = await Promise.all(searchPromises);
    const results = allResults.flat();

    return {
      results: results.slice(0, 20),
      total: results.length,
    };
  }

  getTranslations() {
    return getAllTranslations();
  }

  getAvailableBooks(): string[] {
    return [...this.oldTestamentBooks, ...this.newTestamentBooks];
  }

  async getVerse(reference: BibleReference) {
    return await fetchBibleVerse(reference, this.translationId);
  }

  setTranslation(translationId: string) {
    this.translationId = translationId;
  }
}
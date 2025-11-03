import { SearchResult, BibleSearchResult, BibleReference } from "../types";
import { fetchBibleVerse } from "../api/bible";
import { getTranslationById } from "../data";

export interface SearchFilters {
  testament?: 'old' | 'new' | 'all';
  book?: string;
  phraseMatch?: boolean;
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

    const translation = getTranslationById(this.translationId);
    if (!translation) {
      throw new Error(`Translation ${this.translationId} not found`);
    }

    let allBooks = Object.keys(translation.data);

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
      const bookData = translation.data[book];

      for (const chapter of bookData.chapters) {
        const verses = bookData.verses[chapter] || [];

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
                book: verse.book,
                chapter: verse.chapter,
                verse: verse.verse,
              },
              verse,
              translation: translation.name,
            });
          }
        }
      }
    }

    return {
      results: results.slice(0, 20),
      total: results.length,
    };
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
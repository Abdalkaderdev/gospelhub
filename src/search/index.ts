import { SearchResult, BibleSearchResult, BibleReference } from "../types";
import { fetchBibleVerse } from "../api/bible";
import { getTranslationById } from "../data";

export class SearchService {
  private translationId: string;

  constructor(translationId: string = "kjv") {
    this.translationId = translationId;
  }

  async searchBible(query: string): Promise<SearchResult<BibleSearchResult>> {
    if (!query.trim()) {
      return { results: [], total: 0 };
    }

    const translation = getTranslationById(this.translationId);
    if (!translation) {
      throw new Error(`Translation ${this.translationId} not found`);
    }

    const allBooks = Object.keys(translation.data);
    const results: BibleSearchResult[] = [];

    for (const book of allBooks) {
      const bookData = translation.data[book];
      
      for (const chapter of bookData.chapters) {
        const verses = bookData.verses[chapter] || [];
        
        for (const verse of verses) {
          if (verse.text.toLowerCase().includes(query.toLowerCase())) {
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
      results,
      total: results.length,
    };
  }

  async getVerse(reference: BibleReference) {
    return await fetchBibleVerse(reference, this.translationId);
  }

  setTranslation(translationId: string) {
    this.translationId = translationId;
  }
}
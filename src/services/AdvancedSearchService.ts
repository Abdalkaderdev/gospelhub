import { AdvancedSearchOptions, SearchResultEnhanced, WordFrequencyAnalysis, ConcordanceEntry } from '../types/bible-enhanced';
import { BibleMetadataService } from './BibleMetadataService';

export class AdvancedSearchService {
  static async searchAcrossTranslations(
    query: string,
    options: AdvancedSearchOptions,
    translations: any[]
  ): Promise<SearchResultEnhanced[]> {
    const results: SearchResultEnhanced[] = [];
    const searchTerms = this.prepareSearchTerms(query, options);

    for (const translation of translations) {
      if (options.translations.length && !options.translations.includes(translation.id)) {
        continue;
      }

      const translationResults = await this.searchInTranslation(
        translation,
        searchTerms,
        options
      );
      results.push(...translationResults);
    }

    return this.rankResults(results, query);
  }

  private static prepareSearchTerms(query: string, options: AdvancedSearchOptions): string[] {
    if (options.phrase) {
      return [query];
    }

    let terms = query.split(/\s+/).filter(term => term.length > 0);
    
    if (!options.caseSensitive) {
      terms = terms.map(term => term.toLowerCase());
    }

    return terms;
  }

  private static async searchInTranslation(
    translation: any,
    searchTerms: string[],
    options: AdvancedSearchOptions
  ): Promise<SearchResultEnhanced[]> {
    const results: SearchResultEnhanced[] = [];

    for (const [bookName, bookData] of Object.entries(translation.data)) {
      if (!this.shouldSearchBook(bookName, options)) {
        continue;
      }

      const bookResults = this.searchInBook(
        bookName,
        bookData as any,
        searchTerms,
        options,
        translation.id
      );
      results.push(...bookResults);
    }

    return results;
  }

  private static shouldSearchBook(bookName: string, options: AdvancedSearchOptions): boolean {
    if (options.books && !options.books.includes(bookName)) {
      return false;
    }

    if (options.testament) {
      const testamentBooks = BibleMetadataService.getTestamentBooks(options.testament);
      if (!testamentBooks.includes(bookName)) {
        return false;
      }
    }

    if (options.category) {
      const categoryBooks = BibleMetadataService.getBooksByCategory(options.category);
      if (!categoryBooks.includes(bookName)) {
        return false;
      }
    }

    return true;
  }

  private static searchInBook(
    bookName: string,
    bookData: any,
    searchTerms: string[],
    options: AdvancedSearchOptions,
    translationId: string
  ): SearchResultEnhanced[] {
    const results: SearchResultEnhanced[] = [];

    for (const [chapterNum, verses] of Object.entries(bookData.verses)) {
      const chapter = parseInt(chapterNum);
      
      for (const verse of verses as any[]) {
        const match = this.matchVerse(verse.text, searchTerms, options);
        if (match) {
          results.push({
            reference: { book: bookName, chapter, verse: verse.verse },
            text: verse.text,
            translation: translationId,
            context: this.getContext(bookData.verses, chapter, verse.verse),
            relevanceScore: match.score,
            highlights: match.highlights
          });
        }
      }
    }

    return results;
  }

  private static matchVerse(
    text: string,
    searchTerms: string[],
    options: AdvancedSearchOptions
  ): { score: number; highlights: { start: number; length: number }[] } | null {
    const searchText = options.caseSensitive ? text : text.toLowerCase();
    const highlights: { start: number; length: number }[] = [];
    let score = 0;

    if (options.phrase) {
      const term = options.caseSensitive ? searchTerms[0] : searchTerms[0].toLowerCase();
      const index = searchText.indexOf(term);
      if (index !== -1) {
        highlights.push({ start: index, length: term.length });
        score = 1;
      }
    } else {
      for (const term of searchTerms) {
        const searchTerm = options.caseSensitive ? term : term.toLowerCase();
        
        if (options.wholeWords) {
          const regex = new RegExp(`\\b${this.escapeRegex(searchTerm)}\\b`, 'gi');
          const matches = Array.from(searchText.matchAll(regex));
          if (matches.length > 0) {
            score += matches.length * 0.5;
            matches.forEach(match => {
              highlights.push({ start: match.index!, length: match[0].length });
            });
          }
        } else {
          let index = searchText.indexOf(searchTerm);
          while (index !== -1) {
            highlights.push({ start: index, length: searchTerm.length });
            score += 0.3;
            index = searchText.indexOf(searchTerm, index + 1);
          }
        }
      }
    }

    return score > 0 ? { score, highlights } : null;
  }

  private static escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private static getContext(verses: any, chapter: number, verseNum: number): string {
    const chapterVerses = verses[chapter] || [];
    const verseIndex = chapterVerses.findIndex((v: any) => v.verse === verseNum);
    
    const contextVerses = chapterVerses.slice(
      Math.max(0, verseIndex - 1),
      Math.min(chapterVerses.length, verseIndex + 2)
    );
    
    return contextVerses.map((v: any) => `${v.verse}. ${v.text}`).join(' ');
  }

  private static rankResults(results: SearchResultEnhanced[], query: string): SearchResultEnhanced[] {
    return results.sort((a, b) => {
      // Primary sort by relevance score
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      
      // Secondary sort by book order
      const aBookIndex = BibleMetadataService.getTestamentBooks('Old').concat(
        BibleMetadataService.getTestamentBooks('New')
      ).indexOf(a.reference.book);
      const bBookIndex = BibleMetadataService.getTestamentBooks('Old').concat(
        BibleMetadataService.getTestamentBooks('New')
      ).indexOf(b.reference.book);
      
      if (aBookIndex !== bBookIndex) {
        return aBookIndex - bBookIndex;
      }
      
      // Tertiary sort by chapter and verse
      if (a.reference.chapter !== b.reference.chapter) {
        return a.reference.chapter - b.reference.chapter;
      }
      
      return a.reference.verse - b.reference.verse;
    });
  }

  static analyzeWordFrequency(
    word: string,
    translations: any[]
  ): WordFrequencyAnalysis {
    const analysis: WordFrequencyAnalysis = {
      word,
      count: 0,
      translations: [],
      books: [],
      verses: []
    };

    const bookCounts: Record<string, number> = {};
    const searchWord = word.toLowerCase();

    for (const translation of translations) {
      let translationCount = 0;

      for (const [bookName, bookData] of Object.entries(translation.data)) {
        let bookCount = 0;

        for (const [chapterNum, verses] of Object.entries((bookData as any).verses)) {
          const chapter = parseInt(chapterNum);
          
          for (const verse of verses as any[]) {
            const verseText = verse.text.toLowerCase();
            const matches = verseText.split(searchWord).length - 1;
            
            if (matches > 0) {
              bookCount += matches;
              translationCount += matches;
              analysis.verses.push({
                book: bookName,
                chapter,
                verse: verse.verse
              });
            }
          }
        }

        if (bookCount > 0) {
          bookCounts[bookName] = (bookCounts[bookName] || 0) + bookCount;
        }
      }

      if (translationCount > 0) {
        analysis.translations.push({
          id: translation.id,
          count: translationCount
        });
      }
    }

    analysis.count = analysis.verses.length;
    analysis.books = Object.entries(bookCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return analysis;
  }

  static generateConcordance(
    word: string,
    translations: any[],
    limit: number = 100
  ): ConcordanceEntry {
    const occurrences: ConcordanceEntry['occurrences'] = [];
    const searchWord = word.toLowerCase();

    for (const translation of translations) {
      for (const [bookName, bookData] of Object.entries(translation.data)) {
        for (const [chapterNum, verses] of Object.entries((bookData as any).verses)) {
          const chapter = parseInt(chapterNum);
          
          for (const verse of verses as any[]) {
            if (verse.text.toLowerCase().includes(searchWord)) {
              occurrences.push({
                book: bookName,
                chapter,
                verse: verse.verse,
                text: verse.text,
                translation: translation.id
              });

              if (occurrences.length >= limit) {
                break;
              }
            }
          }
          if (occurrences.length >= limit) break;
        }
        if (occurrences.length >= limit) break;
      }
      if (occurrences.length >= limit) break;
    }

    return {
      word,
      definition: `Occurrences of "${word}" in Scripture`,
      occurrences: occurrences.slice(0, limit),
      relatedWords: this.findRelatedWords(word, occurrences)
    };
  }

  private static findRelatedWords(word: string, occurrences: ConcordanceEntry['occurrences']): string[] {
    const wordFreq: Record<string, number> = {};
    const searchWord = word.toLowerCase();

    for (const occurrence of occurrences) {
      const words = occurrence.text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 3 && w !== searchWord);

      for (const w of words) {
        wordFreq[w] = (wordFreq[w] || 0) + 1;
      }
    }

    return Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([w]) => w);
  }
}
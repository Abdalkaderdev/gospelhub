import Fuse from 'fuse.js';
import { Verse, SearchResult, SearchOptions } from './types';

export class BibleSearch {
  private fuse: Fuse<Verse>;

  constructor(verses: Verse[]) {
    this.fuse = new Fuse(verses, {
      keys: [
        { name: 'text', weight: 0.7 },
        { name: 'reference', weight: 0.3 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true
    });
  }

  search(query: string, options: SearchOptions = {}): SearchResult[] {
    const {
      limit = 50,
      threshold = 0.3,
      includeHighlights = true
    } = options;

    const results = this.fuse.search(query, {
      limit
    });

    return results
      .filter(result => (result.score || 0) <= threshold)
      .map(result => ({
        verse: result.item,
        score: result.score || 0,
        highlights: includeHighlights ? this.getHighlights(result.matches || []) : []
      }));
  }

  private getHighlights(matches: readonly any[]): string[] {
    const highlights: string[] = [];
    
    matches.forEach(match => {
      if (match.indices) {
        match.indices.forEach(([start, end]: [number, number]) => {
          const text = match.value || '';
          const highlighted = text.substring(start, end + 1);
          if (highlighted.trim()) {
            highlights.push(highlighted);
          }
        });
      }
    });

    return highlights;
  }

  // Search by book name
  searchByBook(bookName: string, options: SearchOptions = {}): SearchResult[] {
    return this.search(bookName, {
      ...options,
      threshold: 0.1 // Lower threshold for book names
    });
  }

  // Search by reference (e.g., "Genesis 1:1")
  searchByReference(reference: string, options: SearchOptions = {}): SearchResult[] {
    return this.search(reference, {
      ...options,
      threshold: 0.1 // Lower threshold for references
    });
  }
}
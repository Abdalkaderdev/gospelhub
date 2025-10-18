export interface SearchResult {
  verse: {
    book: string;
    chapter: number;
    verse: number;
    text: string;
    reference: string;
  };
  score: number;
  highlightedText: string;
}

export function searchVerses(verses: any[], query: string): SearchResult[] {
  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  for (const verse of verses) {
    const score = calculateRelevanceScore(verse, searchTerm);
    
    if (score > 0) {
      results.push({
        verse,
        score,
        highlightedText: highlightSearchTerms(verse.text, searchTerm)
      });
    }
  }

  // Sort by relevance score (highest first)
  return results.sort((a, b) => b.score - a.score);
}

export function calculateRelevanceScore(verse: any, searchTerm: string): number {
  let score = 0;
  const text = verse.text.toLowerCase();
  const reference = verse.reference.toLowerCase();
  const searchTermLower = searchTerm.toLowerCase();

  // Exact match in reference gets highest score
  if (reference.includes(searchTermLower)) {
    score += 100;
  }

  // Exact word matches in text
  const words = text.split(/\s+/);
  const searchWords = searchTermLower.split(/\s+/);
  
  for (const word of words) {
    for (const searchWord of searchWords) {
      if (word === searchWord) {
        score += 50;
      } else if (word.includes(searchWord)) {
        score += 25;
      }
    }
  }

  // Partial matches in text
  if (text.includes(searchTermLower)) {
    score += 10;
  }

  // Bonus for multiple occurrences
  const occurrences = (text.match(new RegExp(searchTermLower, 'g')) || []).length;
  score += occurrences * 5;

  return score;
}

export function highlightSearchTerms(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return text;

  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getSearchSuggestions(verses: any[], query: string, limit: number = 5): string[] {
  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase().trim();
  const suggestions = new Set<string>();

  for (const verse of verses) {
    const words = verse.text.toLowerCase().split(/\s+/);
    
    for (const word of words) {
      if (word.includes(searchTerm) && word.length > searchTerm.length) {
        suggestions.add(word);
      }
    }
  }

  return Array.from(suggestions)
    .sort((a, b) => a.length - b.length)
    .slice(0, limit);
}

export function filterVersesByBook(verses: any[], book: string): any[] {
  return verses.filter(verse => 
    verse.book.toLowerCase() === book.toLowerCase()
  );
}

export function filterVersesByChapter(verses: any[], book: string, chapter: number): any[] {
  return verses.filter(verse => 
    verse.book.toLowerCase() === book.toLowerCase() && 
    verse.chapter === chapter
  );
}

export function getPopularSearchTerms(verses: any[]): string[] {
  const termCounts = new Map<string, number>();
  
  for (const verse of verses) {
    const words = verse.text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((word: string) => word.length > 3);
    
    for (const word of words) {
      termCounts.set(word, (termCounts.get(word) || 0) + 1);
    }
  }

  return Array.from(termCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([term]) => term);
}
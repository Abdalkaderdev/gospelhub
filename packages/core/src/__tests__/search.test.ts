import { searchVerses, calculateRelevanceScore, highlightSearchTerms } from '../utils/search';

// Mock verse data for testing
const mockVerses = [
  {
    book: 'John',
    chapter: 3,
    verse: 16,
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    reference: 'John 3:16'
  },
  {
    book: '1 Corinthians',
    chapter: 13,
    verse: 4,
    text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.',
    reference: '1 Corinthians 13:4'
  },
  {
    book: 'Romans',
    chapter: 8,
    verse: 28,
    text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    reference: 'Romans 8:28'
  }
];

describe('Search Utils', () => {
  describe('searchVerses', () => {
    it('should return verses containing the search term', () => {
      const results = searchVerses(mockVerses, 'love');
      expect(results).toHaveLength(3);
      expect(results[0].verse.text).toContain('love');
    });

    it('should be case insensitive', () => {
      const results = searchVerses(mockVerses, 'LOVE');
      expect(results).toHaveLength(3);
    });

    it('should return empty array for no matches', () => {
      const results = searchVerses(mockVerses, 'nonexistent');
      expect(results).toHaveLength(0);
    });

    it('should handle partial word matches', () => {
      const results = searchVerses(mockVerses, 'lov');
      expect(results).toHaveLength(3);
    });

    it('should search in both text and reference', () => {
      const results = searchVerses(mockVerses, 'John');
      expect(results).toHaveLength(1);
      expect(results[0].verse.reference).toBe('John 3:16');
    });
  });

  describe('calculateRelevanceScore', () => {
    it('should give higher score to exact matches', () => {
      const verse = mockVerses[0];
      const exactScore = calculateRelevanceScore(verse, 'love');
      const partialScore = calculateRelevanceScore(verse, 'lov');
      
      expect(exactScore).toBeGreaterThanOrEqual(partialScore);
    });

    it('should give higher score to matches in reference', () => {
      const verse = mockVerses[0];
      const referenceScore = calculateRelevanceScore(verse, 'John');
      const textScore = calculateRelevanceScore(verse, 'world');
      
      expect(referenceScore).toBeGreaterThan(textScore);
    });

    it('should give higher score to multiple matches', () => {
      const verse = mockVerses[1];
      const multipleScore = calculateRelevanceScore(verse, 'love');
      const singleScore = calculateRelevanceScore(verse, 'patient');
      
      expect(multipleScore).toBeGreaterThan(singleScore);
    });
  });

  describe('highlightSearchTerms', () => {
    it('should highlight search terms in text', () => {
      const text = 'For God so loved the world';
      const highlighted = highlightSearchTerms(text, 'love');
      expect(highlighted).toBe('For God so <mark>love</mark>d the world');
    });

    it('should be case insensitive', () => {
      const text = 'For God so LOVED the world';
      const highlighted = highlightSearchTerms(text, 'love');
      expect(highlighted).toBe('For God so <mark>LOVE</mark>D the world');
    });

    it('should handle multiple matches', () => {
      const text = 'Love is patient, love is kind';
      const highlighted = highlightSearchTerms(text, 'love');
      expect(highlighted).toBe('<mark>Love</mark> is patient, <mark>love</mark> is kind');
    });

    it('should return original text if no matches', () => {
      const text = 'For God so loved the world';
      const highlighted = highlightSearchTerms(text, 'nonexistent');
      expect(highlighted).toBe(text);
    });
  });
});
import { getNextChapter, getPreviousChapter, getBookInfo, formatReference } from '../utils/bibleNavigation';

describe('Bible Navigation Utils', () => {
  describe('getNextChapter', () => {
    it('should return next chapter in same book', () => {
      const result = getNextChapter('Genesis', 1);
      expect(result).toEqual({ book: 'Genesis', chapter: 2 });
    });

    it('should return first chapter of next book when at last chapter', () => {
      const result = getNextChapter('Genesis', 50);
      expect(result).toEqual({ book: 'Exodus', chapter: 1 });
    });

    it('should return null when at last chapter of last book', () => {
      const result = getNextChapter('Revelation', 22);
      expect(result).toBeNull();
    });

    it('should handle invalid book names', () => {
      const result = getNextChapter('InvalidBook', 1);
      expect(result).toBeNull();
    });
  });

  describe('getPreviousChapter', () => {
    it('should return previous chapter in same book', () => {
      const result = getPreviousChapter('Genesis', 2);
      expect(result).toEqual({ book: 'Genesis', chapter: 1 });
    });

    it('should return last chapter of previous book when at first chapter', () => {
      const result = getPreviousChapter('Exodus', 1);
      expect(result).toEqual({ book: 'Genesis', chapter: 50 });
    });

    it('should return null when at first chapter of first book', () => {
      const result = getPreviousChapter('Genesis', 1);
      expect(result).toBeNull();
    });

    it('should handle invalid book names', () => {
      const result = getPreviousChapter('InvalidBook', 1);
      expect(result).toBeNull();
    });
  });

  describe('getBookInfo', () => {
    it('should return correct book info for valid book', () => {
      const result = getBookInfo('Genesis');
      expect(result).toEqual({
        name: 'Genesis',
        chapters: 50,
        testament: 'Old Testament',
        category: 'Law'
      });
    });

    it('should return null for invalid book', () => {
      const result = getBookInfo('InvalidBook');
      expect(result).toBeNull();
    });
  });

  describe('formatReference', () => {
    it('should format single verse reference', () => {
      const result = formatReference('John', 3, 16);
      expect(result).toBe('John 3:16');
    });

    it('should format verse range reference', () => {
      const result = formatReference('John', 3, 16, 18);
      expect(result).toBe('John 3:16-18');
    });

    it('should format chapter reference', () => {
      const result = formatReference('John', 3);
      expect(result).toBe('John 3');
    });
  });
});
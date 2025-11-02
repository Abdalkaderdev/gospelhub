export const convertXMLToJSON = (xmlContent: string, translationId: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlContent, 'text/xml');
  
  const bibleElement = doc.querySelector('bible');
  const translation = bibleElement?.getAttribute('translation') || 'Unknown';
  const status = bibleElement?.getAttribute('status') || 'Unknown';
  
  const data: any = {};
  const testaments = doc.querySelectorAll('testament');
  
  testaments.forEach(testament => {
    const books = testament.querySelectorAll('book');
    
    books.forEach((book, bookIndex) => {
      const bookNumber = parseInt(book.getAttribute('number') || '0');
      const bookName = getBookName(bookNumber);
      
      data[bookName] = { chapters: [], verses: {} };
      
      const chapters = book.querySelectorAll('chapter');
      chapters.forEach(chapter => {
        const chapterNum = parseInt(chapter.getAttribute('number') || '0');
        data[bookName].chapters.push(chapterNum);
        data[bookName].verses[chapterNum] = [];
        
        const verses = chapter.querySelectorAll('verse');
        verses.forEach(verse => {
          data[bookName].verses[chapterNum].push({
            verse: parseInt(verse.getAttribute('number') || '0'),
            text: verse.textContent || ''
          });
        });
      });
    });
  });
  
  return {
    id: translationId,
    name: translation,
    abbreviation: translationId.toUpperCase(),
    language: 'English',
    data
  };
};

const getBookName = (number: number): string => {
  const books = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings',
    '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther',
    'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
    'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
    'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum',
    'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
    'Matthew', 'Mark', 'Luke', 'John', 'Acts',
    'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
    'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
    '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
    'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
  ];
  return books[number - 1] || `Book ${number}`;
};
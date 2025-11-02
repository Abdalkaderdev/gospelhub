import fs from 'fs';
import path from 'path';
import { DOMParser } from 'xmldom';

const XML_DIR = './src/data/xml';
const OUTPUT_DIR = './src/data/processed';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function parseXMLFile(filePath) {
  const xmlContent = fs.readFileSync(filePath, 'utf-8');
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlContent, 'text/xml');
  
  const books = [];
  const bookElements = doc.getElementsByTagName('book');
  
  for (let i = 0; i < bookElements.length; i++) {
    const bookEl = bookElements[i];
    const book = {
      name: bookEl.getAttribute('name') || '',
      abbreviation: bookEl.getAttribute('abbr') || '',
      chapters: []
    };
    
    const chapterElements = bookEl.getElementsByTagName('chapter');
    for (let j = 0; j < chapterElements.length; j++) {
      const chapterEl = chapterElements[j];
      const chapter = {
        number: parseInt(chapterEl.getAttribute('number') || '1'),
        verses: []
      };
      
      const verseElements = chapterEl.getElementsByTagName('verse');
      for (let k = 0; k < verseElements.length; k++) {
        const verseEl = verseElements[k];
        const verse = {
          number: parseInt(verseEl.getAttribute('number') || '1'),
          text: verseEl.textContent || '',
          words: []
        };
        
        const wordElements = verseEl.getElementsByTagName('w');
        for (let l = 0; l < wordElements.length; l++) {
          const wordEl = wordElements[l];
          verse.words.push({
            text: wordEl.textContent || '',
            strongsNumber: wordEl.getAttribute('strongs') || undefined,
            morphology: wordEl.getAttribute('morph') || undefined,
            lemma: wordEl.getAttribute('lemma') || undefined
          });
        }
        
        chapter.verses.push(verse);
      }
      
      book.chapters.push(chapter);
    }
    
    books.push(book);
  }
  
  return books;
}

function processAllXMLFiles() {
  const files = fs.readdirSync(XML_DIR).filter(file => file.endsWith('.xml'));
  const translations = {};
  
  console.log(`Processing ${files.length} XML files...`);
  
  files.forEach((file, index) => {
    const filePath = path.join(XML_DIR, file);
    const translationId = path.basename(file, '.xml');
    
    try {
      console.log(`Processing ${index + 1}/${files.length}: ${translationId}`);
      const books = parseXMLFile(filePath);
      
      // Convert to optimized format
      const data = {};
      books.forEach(book => {
        data[book.name] = {
          abbreviation: book.abbreviation,
          verses: {}
        };
        book.chapters.forEach(chapter => {
          data[book.name].verses[chapter.number] = chapter.verses;
        });
      });
      
      translations[translationId] = {
        id: translationId,
        name: extractTranslationName(translationId),
        abbreviation: extractAbbreviation(translationId),
        data
      };
      
      // Save individual translation file
      const outputPath = path.join(OUTPUT_DIR, `${translationId}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(translations[translationId], null, 2));
      
    } catch (error) {
      console.error(`Error processing ${translationId}:`, error.message);
    }
  });
  
  // Save translations index
  const indexPath = path.join(OUTPUT_DIR, 'index.json');
  const translationsList = Object.values(translations).map(t => ({
    id: t.id,
    name: t.name,
    abbreviation: t.abbreviation
  }));
  
  fs.writeFileSync(indexPath, JSON.stringify(translationsList, null, 2));
  
  console.log(`Processed ${Object.keys(translations).length} translations successfully!`);
}

function extractTranslationName(id) {
  const nameMap = {
    'EnglishKJBible': 'King James Version',
    'EnglishESVBible': 'English Standard Version',
    'EnglishNIVBible': 'New International Version',
    'SpanishRVR1960Bible': 'Reina-Valera 1960',
    'FrenchBible': 'Louis Segond 1910',
    'GermanBible': 'Luther Bibel 1912'
  };
  
  return nameMap[id] || id.replace(/Bible$/, '').replace(/([A-Z])/g, ' $1').trim();
}

function extractAbbreviation(id) {
  const abbrevMap = {
    'EnglishKJBible': 'KJV',
    'EnglishESVBible': 'ESV',
    'EnglishNIVBible': 'NIV',
    'SpanishRVR1960Bible': 'RVR1960',
    'FrenchBible': 'LSG',
    'GermanBible': 'LUT'
  };
  
  return abbrevMap[id] || id.substring(0, 3).toUpperCase();
}

processAllXMLFiles();
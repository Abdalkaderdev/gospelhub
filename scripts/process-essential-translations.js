#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const XML_DIR = path.resolve(__dirname, '../src/data/xml');
const OUTPUT_DIR = path.resolve(__dirname, '../src/data/processed');

const ESSENTIAL_TRANSLATIONS = {
  'eng-kjv': 'EnglishKJBible.xml',
  'eng-asv': 'EnglishASVBible.xml', 
  'eng-ylt': 'EnglishYLTBible.xml',
  'grc': 'GreekBible.xml',
  'hbo': 'HebrewBible.xml',
  'eng-esv': 'EnglishESVBible.xml',
  'eng-niv': 'EnglishNIVBible.xml',
  'eng-nlt': 'EnglishNLTBible.xml',
  'spa-rv60': 'SpanishRVR1960Bible.xml',
  'spa-nvi': 'SpanishNVIBible.xml',
  'ara-svd': 'ArabicSVDBible.xml',
  'ara-vd': 'ArabicAVDBible.xml',
  'fra-lsg': 'FrenchBible.xml',
  'fra-ost': 'FrenchOstervaldBible.xml',
  'deu-luther': 'GermanBible.xml',
  'deu-schlachter': 'GermanSchlachter2000Bible.xml',
  'nld-stv': 'DutchSVVBible.xml',
  'nld-nbv': 'DutchNBGBible.xml',
  'kur-cbd': 'KurdishBible.xml'
};

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function parseXMLContent(xmlContent) {
  const books = [];
  const bookNames = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
    '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah',
    'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
    'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah',
    'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
    'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
    'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
    '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
    '1 John', '2 John', '3 John', 'Jude', 'Revelation'
  ];
  
  const bookMatches = xmlContent.match(/<book number="\d+"[\s\S]*?<\/book>/g) || [];
  
  bookMatches.forEach(bookXml => {
    const bookNumberMatch = bookXml.match(/number="(\d+)"/);
    if (!bookNumberMatch) return;
    
    const bookNumber = parseInt(bookNumberMatch[1]);
    const bookName = bookNames[bookNumber - 1] || `Book ${bookNumber}`;
    
    const book = {
      name: bookName,
      abbreviation: bookName.substring(0, 3),
      chapters: []
    };
    
    const chapterMatches = bookXml.match(/<chapter number="\d+"[\s\S]*?<\/chapter>/g) || [];
    
    chapterMatches.forEach(chapterXml => {
      const chapterNumMatch = chapterXml.match(/number="(\d+)"/);
      if (!chapterNumMatch) return;
      
      const chapter = {
        number: parseInt(chapterNumMatch[1]),
        verses: []
      };
      
      const verseMatches = chapterXml.match(/<verse number="\d+"[^>]*>[\s\S]*?<\/verse>/g) || [];
      
      verseMatches.forEach(verseXml => {
        const verseNumMatch = verseXml.match(/number="(\d+)"/);
        if (!verseNumMatch) return;
        
        const textContent = verseXml.replace(/<[^>]*>/g, '').trim();
        
        const verse = {
          number: parseInt(verseNumMatch[1]),
          text: textContent,
          words: []
        };
        
        chapter.verses.push(verse);
      });
      
      if (chapter.verses.length > 0) {
        book.chapters.push(chapter);
      }
    });
    
    if (book.chapters.length > 0) {
      books.push(book);
    }
  });
  
  return books;
}

function processEssentialTranslations() {
  const translations = [];
  const processed = [];
  
  console.log('Processing essential translations...');
  
  Object.entries(ESSENTIAL_TRANSLATIONS).forEach(([id, filename]) => {
    const filePath = path.join(XML_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filename}`);
      return;
    }
    
    try {
      console.log(`Processing: ${id} (${filename})`);
      const xmlContent = fs.readFileSync(filePath, 'utf-8');
      const books = parseXMLContent(xmlContent);
      
      if (books.length === 0) {
        console.warn(`No books found in ${id}`);
        return;
      }
      
      console.log(`  Found ${books.length} books: ${books.map(b => b.name).slice(0, 5).join(', ')}${books.length > 5 ? '...' : ''}`);
      
      const data = {};
      books.forEach(book => {
        data[book.name] = {
          abbreviation: book.abbreviation,
          chapters: book.chapters.map(ch => ch.number),
          verses: {}
        };
        book.chapters.forEach(chapter => {
          data[book.name].verses[chapter.number] = chapter.verses;
        });
      });
      
      const translation = {
        id,
        name: getTranslationName(id),
        abbreviation: getAbbreviation(id),
        language: getLanguage(id),
        data
      };
      
      translations.push(translation);
      processed.push(id);
      
      const outputPath = path.join(OUTPUT_DIR, `${id}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(translation, null, 2));
      
    } catch (error) {
      console.error(`Error processing ${id}:`, error.message);
    }
  });
  
  const indexPath = path.join(OUTPUT_DIR, 'index.json');
  const translationsList = translations.map(t => ({
    id: t.id,
    name: t.name,
    abbreviation: t.abbreviation,
    language: t.language
  }));
  
  fs.writeFileSync(indexPath, JSON.stringify(translationsList, null, 2));
  
  console.log(`Successfully processed ${processed.length} essential translations:`);
  processed.forEach(id => console.log(`  ✓ ${id}`));
}

function getTranslationName(id) {
  const names = {
    'eng-kjv': 'King James Version',
    'eng-asv': 'American Standard Version',
    'eng-ylt': 'Young\'s Literal Translation',
    'grc': 'Greek New Testament',
    'hbo': 'Hebrew Old Testament',
    'eng-esv': 'English Standard Version',
    'eng-niv': 'New International Version',
    'eng-nlt': 'New Living Translation',
    'spa-rv60': 'Reina-Valera 1960',
    'spa-nvi': 'Nueva Versión Internacional',
    'ara-svd': 'Smith-Van Dyke Arabic Bible',
    'ara-vd': 'Van Dyke Arabic Bible',
    'fra-lsg': 'Louis Segond 1910',
    'fra-ost': 'French Ostervald',
    'deu-luther': 'Luther Bible',
    'deu-schlachter': 'Schlachter 2000',
    'nld-stv': 'Statenvertaling',
    'nld-nbv': 'Nieuwe Bijbelvertaling',
    'kur-cbd': 'Kurdish Bible'
  };
  return names[id] || id;
}

function getAbbreviation(id) {
  const abbrevs = {
    'eng-kjv': 'KJV',
    'eng-asv': 'ASV',
    'eng-ylt': 'YLT',
    'grc': 'GRC',
    'hbo': 'HEB',
    'eng-esv': 'ESV',
    'eng-niv': 'NIV',
    'eng-nlt': 'NLT',
    'spa-rv60': 'RV60',
    'spa-nvi': 'NVI',
    'ara-svd': 'SVD',
    'ara-vd': 'VD',
    'fra-lsg': 'LSG',
    'fra-ost': 'OST',
    'deu-luther': 'LUT',
    'deu-schlachter': 'SCH',
    'nld-stv': 'STV',
    'nld-nbv': 'NBV',
    'kur-cbd': 'KUR'
  };
  return abbrevs[id] || id.toUpperCase();
}

function getLanguage(id) {
  const languages = {
    'eng-kjv': 'English',
    'eng-asv': 'English',
    'eng-ylt': 'English',
    'grc': 'Greek',
    'hbo': 'Hebrew',
    'eng-esv': 'English',
    'eng-niv': 'English',
    'eng-nlt': 'English',
    'spa-rv60': 'Spanish',
    'spa-nvi': 'Spanish',
    'ara-svd': 'Arabic',
    'ara-vd': 'Arabic',
    'fra-lsg': 'French',
    'fra-ost': 'French',
    'deu-luther': 'German',
    'deu-schlachter': 'German',
    'nld-stv': 'Dutch',
    'nld-nbv': 'Dutch',
    'kur-cbd': 'Kurdish'
  };
  return languages[id] || 'Unknown';
}

processEssentialTranslations();
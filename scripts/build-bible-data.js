#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const XML_DIR = path.resolve(__dirname, '../src/data/xml');
const OUTPUT_DIR = path.resolve(__dirname, '../src/data/processed');

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Simple XML parser without external dependencies
function parseXMLContent(xmlContent) {
  const books = [];
  
  // Extract books using regex (simple approach)
  const bookMatches = xmlContent.match(/<book[^>]*>[\s\S]*?<\/book>/g) || [];
  
  bookMatches.forEach(bookXml => {
    const nameMatch = bookXml.match(/name="([^"]*)"/) || bookXml.match(/n="([^"]*)"/);
    const abbrMatch = bookXml.match(/abbr="([^"]*)"/) || bookXml.match(/bnumber="([^"]*)"/);
    
    if (!nameMatch) return;
    
    const book = {
      name: nameMatch[1],
      abbreviation: abbrMatch ? abbrMatch[1] : nameMatch[1].substring(0, 3),
      chapters: []
    };
    
    // Extract chapters
    const chapterMatches = bookXml.match(/<chapter[^>]*>[\s\S]*?<\/chapter>/g) || [];
    
    chapterMatches.forEach(chapterXml => {
      const chapterNumMatch = chapterXml.match(/cnumber="([^"]*)"/) || chapterXml.match(/number="([^"]*)"/);
      if (!chapterNumMatch) return;
      
      const chapter = {
        number: parseInt(chapterNumMatch[1]),
        verses: []
      };
      
      // Extract verses
      const verseMatches = chapterXml.match(/<verse[^>]*>[\s\S]*?<\/verse>/g) || [];
      
      verseMatches.forEach(verseXml => {
        const verseNumMatch = verseXml.match(/vnumber="([^"]*)"/) || verseXml.match(/number="([^"]*)"/);
        if (!verseNumMatch) return;
        
        // Extract text content, removing XML tags
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

function processXMLFiles() {
  const files = fs.readdirSync(XML_DIR).filter(file => file.endsWith('.xml'));
  const translations = [];
  
  console.log(`Processing ${files.length} XML files...`);
  
  files.slice(0, 10).forEach((file, index) => { // Process first 10 for testing
    const filePath = path.join(XML_DIR, file);
    const translationId = path.basename(file, '.xml');
    
    try {
      console.log(`Processing ${index + 1}/10: ${translationId}`);
      const xmlContent = fs.readFileSync(filePath, 'utf-8');
      const books = parseXMLContent(xmlContent);
      
      if (books.length === 0) {
        console.warn(`No books found in ${translationId}`);
        return;
      }
      
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
      
      const translation = {
        id: translationId,
        name: extractTranslationName(translationId),
        abbreviation: extractAbbreviation(translationId),
        data
      };
      
      translations.push(translation);
      
      // Save individual translation file
      const outputPath = path.join(OUTPUT_DIR, `${translationId}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(translation, null, 2));
      
    } catch (error) {
      console.error(`Error processing ${translationId}:`, error.message);
    }
  });
  
  // Save translations index
  const indexPath = path.join(OUTPUT_DIR, 'index.json');
  const translationsList = translations.map(t => ({
    id: t.id,
    name: t.name,
    abbreviation: t.abbreviation
  }));
  
  fs.writeFileSync(indexPath, JSON.stringify(translationsList, null, 2));
  
  console.log(`Successfully processed ${translations.length} translations!`);
}

function extractTranslationName(id) {
  const nameMap = {
    'EnglishKJBible': 'King James Version',
    'EnglishESVBible': 'English Standard Version',
    'EnglishNIVBible': 'New International Version',
    'EnglishNASBBible': 'New American Standard Bible',
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
    'EnglishNASBBible': 'NASB',
    'SpanishRVR1960Bible': 'RVR1960',
    'FrenchBible': 'LSG',
    'GermanBible': 'LUT'
  };
  
  return abbrevMap[id] || id.substring(0, 3).toUpperCase();
}

processXMLFiles();
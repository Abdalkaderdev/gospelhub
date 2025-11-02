import { BibleBook } from '../../types';
import { genesisXML } from './genesis';
import { johnXML } from './john';

export const xmlBibleData: { [key: string]: BibleBook[] } = {
  kjv: [genesisXML, johnXML],
  esv: [genesisXML, johnXML] // Same structure, different translations would have different text
};

export const getXMLBook = (translationId: string, bookName: string): BibleBook | null => {
  const books = xmlBibleData[translationId];
  if (!books) return null;
  
  return books.find(book => 
    book.name.toLowerCase() === bookName.toLowerCase() ||
    book.abbreviation.toLowerCase() === bookName.toLowerCase()
  ) || null;
};

export const getXMLChapter = (translationId: string, bookName: string, chapterNum: number) => {
  const book = getXMLBook(translationId, bookName);
  return book?.chapters.find(ch => ch.number === chapterNum) || null;
};
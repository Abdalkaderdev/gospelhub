import { BibleTranslation } from "../types";
import { kjvTranslation } from "./kjv";
import { esvTranslation } from "./esv";
import { nivTranslation } from "./niv";
import { bibleXMLService } from "../services/BibleXMLService";

export function getTranslationById(id: string): BibleTranslation | undefined {
  return bibleTranslations.find((translation) => translation.id === id);
}

// XML-based translations
const xmlTranslations: BibleTranslation[] = [
  { id: 'EnglishKJBible', name: 'King James Version (XML)', abbreviation: 'KJV', data: {} },
  { id: 'EnglishESVBible', name: 'English Standard Version (XML)', abbreviation: 'ESV', data: {} },
  { id: 'EnglishNIVBible', name: 'New International Version (XML)', abbreviation: 'NIV', data: {} },
  { id: 'EnglishNASBBible', name: 'New American Standard Bible', abbreviation: 'NASB', data: {} },
  { id: 'EnglishNLTBible', name: 'New Living Translation', abbreviation: 'NLT', data: {} },
  { id: 'EnglishCSBBible', name: 'Christian Standard Bible', abbreviation: 'CSB', data: {} },
  { id: 'EnglishNRSVBible', name: 'New Revised Standard Version', abbreviation: 'NRSV', data: {} },
  { id: 'Spanish1569Bible', name: 'Reina-Valera 1569', abbreviation: 'RV1569', data: {} },
  { id: 'SpanishRVR1960Bible', name: 'Reina-Valera 1960', abbreviation: 'RVR1960', data: {} },
  { id: 'FrenchBible', name: 'Louis Segond 1910', abbreviation: 'LSG', data: {} },
  { id: 'GermanBible', name: 'Luther Bibel 1912', abbreviation: 'LUT', data: {} },
  { id: 'ChineseSimplifiedBible', name: 'Chinese Union Version Simplified', abbreviation: 'CUVS', data: {} },
  { id: 'ChineseTraditionalBible', name: 'Chinese Union Version Traditional', abbreviation: 'CUVT', data: {} },
  { id: 'Portuguese1969Bible', name: 'Almeida Revista e Atualizada', abbreviation: 'ARA', data: {} },
  { id: 'Russian2012Bible', name: 'Russian Synodal Translation', abbreviation: 'RST', data: {} },
  { id: 'Arabic1978Bible', name: 'Arabic Van Dyke Bible', abbreviation: 'AVD', data: {} },
  { id: 'Korean2021Bible', name: 'Korean Revised Version', abbreviation: 'KRV', data: {} },
  { id: 'Japanese1965Bible', name: 'Japanese Living Bible', abbreviation: 'JLB', data: {} },
  { id: 'Hindi2017Bible', name: 'Hindi Bible', abbreviation: 'HIN', data: {} },
  { id: 'Swahili2001Bible', name: 'Swahili Bible', abbreviation: 'SWA', data: {} }
];

export const bibleTranslations: BibleTranslation[] = [
  kjvTranslation,
  esvTranslation,
  nivTranslation,
  ...xmlTranslations
];

export const defaultTranslationId = "kjv";

// Helper function to load XML translation data
export async function loadXMLTranslation(translationId: string): Promise<BibleTranslation | null> {
  try {
    const books = await bibleXMLService.loadTranslation(translationId);
    const translation = xmlTranslations.find(t => t.id === translationId);
    if (translation && books.length > 0) {
      // Convert books array to the expected data structure
      const data: { [bookName: string]: { verses: { [chapter: number]: any[] } } } = {};
      books.forEach(book => {
        data[book.name] = { verses: {} };
        book.chapters.forEach(chapter => {
          data[book.name].verses[chapter.number] = chapter.verses;
        });
      });
      return { ...translation, data };
    }
    return null;
  } catch (error) {
    console.error(`Failed to load XML translation ${translationId}:`, error);
    return null;
  }
}
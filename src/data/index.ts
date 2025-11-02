import { BibleTranslation } from "../types";

let processedTranslations: BibleTranslation[] = [];
let translationsLoaded = false;

// Load processed translations from JSON files
async function loadProcessedTranslations(): Promise<BibleTranslation[]> {
  if (translationsLoaded) return processedTranslations;
  
  try {
    const indexResponse = await fetch('/src/data/processed/index.json');
    const translationsList = await indexResponse.json();
    
    for (const meta of translationsList) {
      try {
        const response = await fetch(`/src/data/processed/${meta.id}.json`);
        const translation = await response.json();
        processedTranslations.push(translation);
      } catch (error) {
        console.warn(`Failed to load translation ${meta.id}:`, error);
      }
    }
    
    translationsLoaded = true;
    return processedTranslations;
  } catch (error) {
    console.error('Failed to load processed translations:', error);
    return [];
  }
}

export async function getBibleTranslations(): Promise<BibleTranslation[]> {
  return await loadProcessedTranslations();
}

export async function getTranslationById(id: string): Promise<BibleTranslation | undefined> {
  const translations = await loadProcessedTranslations();
  return translations.find((translation) => translation.id === id);
}

export const defaultTranslationId = "eng-kjv";

// Legacy export for backward compatibility
export const bibleTranslations: BibleTranslation[] = [];